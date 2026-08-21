import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const sesClient = new SESClient({});

export const handler = async (event) => {
  console.log("Daily summary cron triggered.");

  const ACTIVITY_TABLE = process.env.ACTIVITY_TABLE;
  const SES_EMAIL = process.env.SES_EMAIL;

  if (!ACTIVITY_TABLE || !SES_EMAIL) {
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
    return { statusCode: 200, body: "Successfully sent daily summary email." };

  } catch (err) {
    console.error("Error generating daily summary: ", err);
    return { statusCode: 500, body: "Error generating daily summary." };
  }
};
