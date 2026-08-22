import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const authorizer = event.requestContext?.authorizer || {};
    const claims = authorizer.jwt?.claims || authorizer.claims || {};
    const userId = claims.sub;

    const command = new QueryCommand({
      TableName: process.env.PROGRESS_TABLE,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": userId,
      },
    });

    const response = await docClient.send(command);
    const progress = response.Items || [];

    // Calculate Global Percentile
    let percentile = null;
    if (progress.length > 0 && process.env.AGGREGATES_TABLE) {
      try {
        const getAggCmd = new GetCommand({
          TableName: process.env.AGGREGATES_TABLE,
          Key: { testId: "SAT_GLOBAL_SCORES" }
        });
        const aggRes = await docClient.send(getAggCmd);
        
        if (aggRes.Item && aggRes.Item.testCount > 0) {
          const globalAvg = aggRes.Item.totalScaledScore / aggRes.Item.testCount;
          
          let userTotal = 0;
          let userCount = 0;
          progress.forEach(p => {
            if (p.scaledScore) {
              userTotal += p.scaledScore;
              userCount += 1;
            }
          });
          
          if (userCount > 0) {
            const userAvg = userTotal / userCount;
            // Mock normal distribution approximation
            // Z-score assuming standard deviation of 200
            const zScore = (userAvg - globalAvg) / 200;
            // Sigmoid approximation for CDF
            const pct = (1 / (1 + Math.exp(-1.702 * zScore))) * 100;
            percentile = Math.max(1, Math.min(99, Math.round(pct)));
          }
        }
      } catch (aggErr) {
        console.error("Failed to fetch aggregates:", aggErr);
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Dashboard fetched successfully",
        progress: progress,
        percentile: percentile
      }),
    };
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Failed to fetch dashboard" }),
    };
  }
};
