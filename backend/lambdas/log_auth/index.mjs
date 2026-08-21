import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Cognito Post Authentication Triggered: ", JSON.stringify(event, null, 2));

  const ACTIVITY_TABLE = process.env.ACTIVITY_TABLE;
  
  if (!ACTIVITY_TABLE) {
    console.error("ACTIVITY_TABLE environment variable is not set.");
    return event;
  }

  const email = event.request.userAttributes.email;
  const timestamp = new Date().toISOString();
  // Using the YYYY-MM-DD format for the partition key "date"
  const date = timestamp.split("T")[0];

  try {
    const command = new PutCommand({
      TableName: ACTIVITY_TABLE,
      Item: {
        date: date,
        timestamp: timestamp,
        email: email,
        action: "LOGIN",
        details: "User logged in successfully"
      }
    });

    await docClient.send(command);
    console.log(`Successfully logged login event for ${email} at ${timestamp}`);
  } catch (error) {
    console.error("Error logging activity to DynamoDB: ", error);
    // We don't want to fail the login process if logging fails
  }

  // Cognito Post Authentication triggers MUST return the event back to Cognito
  return event;
};
