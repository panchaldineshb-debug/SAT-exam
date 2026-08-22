import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const AGGREGATES_TABLE = process.env.AGGREGATES_TABLE;

export const handler = async (event) => {
  try {
    const data = await docClient.send(new ScanCommand({
      TableName: AGGREGATES_TABLE
    }));

    const ratings = {};
    for (const item of data.Items || []) {
      const totalAvg = item.reviewCount > 0 ? (item.totalStars / item.reviewCount) : 0;
      const studentAvg = item.studentCount > 0 ? (item.studentStars / item.studentCount) : 0;
      const teacherAvg = item.teacherCount > 0 ? (item.teacherStars / item.teacherCount) : 0;
      
      ratings[item.testId] = {
        averageRating: Math.round(totalAvg * 10) / 10,
        reviewCount: item.reviewCount || 0,
        studentRating: Math.round(studentAvg * 10) / 10,
        studentCount: item.studentCount || 0,
        teacherRating: Math.round(teacherAvg * 10) / 10,
        teacherCount: item.teacherCount || 0
      };
    }

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(ratings)
    };
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
