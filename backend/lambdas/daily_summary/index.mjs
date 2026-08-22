import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const sesClient = new SESClient({});
const s3Client = new S3Client({});

export const handler = async (event) => {
  console.log("Daily summary cron triggered.");

  const ACTIVITY_TABLE = process.env.ACTIVITY_TABLE;
  const PROGRESS_TABLE = process.env.PROGRESS_TABLE;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const SES_EMAIL = process.env.SES_EMAIL;

  if (!ACTIVITY_TABLE || !SES_EMAIL || !PROGRESS_TABLE || !S3_BUCKET_NAME) {
    console.error("Missing required environment variables.");
    return { statusCode: 500, body: "Missing required environment variables." };
  }

  // Get yesterday's date (to run at midnight UTC, or we can just query today's date)
  // Let's query today's date in UTC
  const today = new Date().toISOString().split("T")[0];

  try {
    const queryCmd = new QueryCommand({
      TableName: ACTIVITY_TABLE,
      KeyConditionExpression: "#d = :dateVal",
      ExpressionAttributeNames: {
        "#d": "date"
      },
      ExpressionAttributeValues: {
        ":dateVal": today
      }
    });

    const response = await docClient.send(queryCmd);
    const activities = response.Items || [];

    if (activities.length === 0) {
      console.log("No activity today. Skipping email.");
      return { statusCode: 200, body: "No activity today. Skipping email." };
    }

    let logins = 0;
    let tests = 0;
    let detailsHtml = "<ul>";

    activities.forEach(act => {
      if (act.action === "LOGIN") logins++;
      if (act.action === "TEST_COMPLETED") tests++;
      
      const time = new Date(act.timestamp).toLocaleTimeString();
      detailsHtml += `<li><strong>${time}</strong> - ${act.email}: ${act.details}</li>`;
    });
    detailsHtml += "</ul>";

    const htmlBody = `
      <h2>SAT Exam Platform - Daily Summary (${today})</h2>
      <p>Here is the summary of student activity today:</p>
      <ul>
        <li><strong>Total Logins:</strong> ${logins}</li>
        <li><strong>Tests Completed:</strong> ${tests}</li>
      </ul>
      <h3>Detailed Activity Log:</h3>
      ${detailsHtml}
    `;

    const sendEmailCmd = new SendEmailCommand({
      Source: SES_EMAIL,
      Destination: {
        ToAddresses: [SES_EMAIL],
      },
      Message: {
        Subject: {
          Data: `SAT Exam Daily Summary - ${today}`
        },
        Body: {
          Html: {
            Data: htmlBody
          }
        }
      }
    });

    await sesClient.send(sendEmailCmd);
    console.log("Successfully sent daily summary email.");

    // Generate Percentile Data
    try {
      const scanCmd = new ScanCommand({
        TableName: PROGRESS_TABLE,
        FilterExpression: "#status = :statusVal",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":statusVal": "COMPLETED"
        }
      });
      const progressRes = await docClient.send(scanCmd);
      const scores = (progressRes.Items || [])
        .filter(i => typeof i.score === 'number' && i.totalQuestions)
        .map(i => Math.round((i.score / i.totalQuestions) * 100));

      const putObjCmd = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: "data/scores_distribution.json",
        Body: JSON.stringify(scores),
        ContentType: "application/json"
      });
      await s3Client.send(putObjCmd);
      console.log(`Successfully uploaded scores_distribution.json with ${scores.length} scores.`);
    } catch (s3Err) {
      console.error("Error generating percentile distribution: ", s3Err);
    }

    return { statusCode: 200, body: "Successfully processed daily summary and percentiles." };

  } catch (err) {
    console.error("Error generating daily summary: ", err);
    return { statusCode: 500, body: "Error generating daily summary." };
  }
};
