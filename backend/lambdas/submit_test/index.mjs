import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const body = JSON.parse(event.body);
    const { testId, answers } = body; // answers is an object: { questionId: "A" }

    if (!testId || !answers) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "testId and answers are required" }),
      };
    }

    // 1. Fetch the secure answer key from DynamoDB
    const getTestCmd = new GetCommand({
      TableName: process.env.TESTS_TABLE,
      Key: { testId: testId },
    });
    const testResult = await docClient.send(getTestCmd);

    if (!testResult.Item) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Test not found in secure database" }),
      };
    }

    const testItem = testResult.Item;
    // Assume testItem has a `questions` array with `id` and `key`
    let score = 0;
    const totalQuestions = testItem.questions.length;
    const gradedAnswers = {};

    testItem.questions.forEach((q) => {
      const chosen = answers[q.id];
      const correctKey = q.key.trim().toLowerCase().replace(/,/g, '');
      const normChosen = chosen ? chosen.trim().toLowerCase().replace(/,/g, '') : '';
      
      const isCorrect = normChosen === correctKey;
      if (isCorrect) score += 1;

      gradedAnswers[q.id] = {
        chosen: chosen || null,
        correctKey: q.key,
        isCorrect: isCorrect,
        explanation: q.explanation || null
      };
    });

    // 2. Save the result to User Progress table
    const dateStr = new Date().toLocaleDateString();
    
    const putProgressCmd = new PutCommand({
      TableName: process.env.PROGRESS_TABLE,
      Item: {
        userId: userId,
        testId: testId,
        status: "COMPLETED",
        score: score,
        totalQuestions: totalQuestions,
        answers: answers,
        gradedAnswers: gradedAnswers,
        completedAt: new Date().toISOString(),
        date: dateStr
      },
    });
    
    await docClient.send(putProgressCmd);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Test graded successfully",
        score: score,
        totalQuestions: totalQuestions,
        gradedAnswers: gradedAnswers
      }),
    };
  } catch (error) {
    console.error("Error submitting test:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Failed to submit test" }),
    };
  }
};
