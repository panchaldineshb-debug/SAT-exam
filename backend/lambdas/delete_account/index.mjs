import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 200, body: "" };
  }

  try {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    
    if (!userId) {
      return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
    }

    const userPoolId = process.env.USER_POOL_ID;

    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: userId
    });

    await cognitoClient.send(command);

    console.log(`Successfully deleted user account: ${userId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Account successfully deleted." })
    };
  } catch (err) {
    console.error("Error deleting account:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete account.", error: err.message })
    };
  }
};
