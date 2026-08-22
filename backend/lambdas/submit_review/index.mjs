import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const REVIEWS_TABLE = process.env.REVIEWS_TABLE;
const AGGREGATES_TABLE = process.env.AGGREGATES_TABLE;

export const handler = async (event) => {
  const authorizer = event.requestContext?.authorizer;
  const userId = authorizer?.jwt?.claims?.sub || authorizer?.claims?.sub;

  if (!userId) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { testId, rating, difficulty, role, comment } = body;
  if (!testId || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid testId or rating" }) };
  }

  try {
    // Check if user already reviewed
    const getRes = await docClient.send(new GetCommand({
      TableName: REVIEWS_TABLE,
      Key: { testId: String(testId), userId }
    }));
    
    const existingReview = getRes.Item;
    
    // Put review
    await docClient.send(new PutCommand({
      TableName: REVIEWS_TABLE,
      Item: {
        testId: String(testId),
        userId,
        rating,
        difficulty: difficulty || 'Unknown',
        role: role || 'Student',
        comment: comment || '',
        timestamp: new Date().toISOString()
      }
    }));

    // Update aggregates
    const newRoleKey = role === 'Teacher/Tutor' ? 'teacher' : (role === 'Parent' ? 'parent' : 'student');
    let addActions = [];
    let exprValues = {};
    
    if (existingReview) {
      const oldRoleKey = existingReview.role === 'Teacher/Tutor' ? 'teacher' : (existingReview.role === 'Parent' ? 'parent' : 'student');
      
      if (oldRoleKey === newRoleKey) {
        const diff = rating - existingReview.rating;
        if (diff !== 0) {
          addActions.push(`${newRoleKey}Stars :d`);
          addActions.push(`totalStars :d`);
          exprValues[":d"] = diff;
        }
      } else {
        addActions.push(`${oldRoleKey}Stars :negOldRating`);
        addActions.push(`${oldRoleKey}Count :negOne`);
        addActions.push(`${newRoleKey}Stars :newRating`);
        addActions.push(`${newRoleKey}Count :posOne`);
        
        exprValues[":negOldRating"] = -existingReview.rating;
        exprValues[":negOne"] = -1;
        exprValues[":newRating"] = rating;
        exprValues[":posOne"] = 1;
        
        const diff = rating - existingReview.rating;
        if (diff !== 0) {
           addActions.push(`totalStars :diff`);
           exprValues[":diff"] = diff;
        }
      }
    } else {
      addActions.push(`${newRoleKey}Stars :r`);
      addActions.push(`${newRoleKey}Count :one`);
      addActions.push(`totalStars :r`);
      addActions.push(`reviewCount :one`);
      
      exprValues[":r"] = rating;
      exprValues[":one"] = 1;
    }

    if (addActions.length > 0) {
      await docClient.send(new UpdateCommand({
        TableName: AGGREGATES_TABLE,
        Key: { testId: String(testId) },
        UpdateExpression: "ADD " + addActions.join(", "),
        ExpressionAttributeValues: exprValues
      }));
    }

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ message: "Review submitted" })
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
