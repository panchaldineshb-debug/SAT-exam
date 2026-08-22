import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

export const handler = async (event) => {
  for (const record of event.Records) {
    let body;
    try {
      body = JSON.parse(record.body);
    } catch (e) {
      console.error("Failed to parse SQS message body:", e);
      continue;
    }

    const { userId, testId, score, totalQuestions, incorrectTopics } = body;

    if (!userId || !testId) {
      console.error("Missing userId or testId in message", body);
      continue;
    }

    const promptText = `You are an expert SAT tutor. The student just took a practice test.
They scored ${score} out of ${totalQuestions}.
They struggled with these topics or questions:
${incorrectTopics || "General errors"}

Please provide 2-3 short, encouraging paragraphs of study advice. Be direct, supportive, and give actionable next steps.`;

      const input = {
      modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText
              }
            ]
          }
        ]
      })
    };

    try {
      const command = new InvokeModelCommand(input);
      const response = await bedrockClient.send(command);
      
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const adviceText = responseBody.content[0].text;

      // Save advice to DynamoDB
      const updateCmd = new UpdateCommand({
        TableName: process.env.PROGRESS_TABLE,
        Key: { userId, testId },
        UpdateExpression: "SET aiAdvice = :a",
        ExpressionAttributeValues: {
          ":a": adviceText
        }
      });
      
      await docClient.send(updateCmd);
      console.log(`Successfully generated and saved AI advice for User: ${userId}, Test: ${testId}`);

    } catch (error) {
      console.error("Error generating or saving AI advice:", error);
      
      // If Bedrock throttles or times out, we throw an error so SQS automatically retries the message later
      if (error.name === "ThrottlingException" || error.name === "ModelTimeoutException" || error.name === "Throttling") {
        throw error; 
      }
      
      // If the user hasn't enabled the Anthropic model or uses an invalid profile, save a helpful message instead of failing silently
      if (error.name === "ResourceNotFoundException" || error.name === "AccessDeniedException" || error.name === "ValidationException") {
        console.log("Model not enabled or unsupported inference profile. Saving fallback instruction message.");
        const fallbackAdvice = "⚠️ Your AI Tutor could not be loaded because the Anthropic Claude model could not be accessed in your AWS account.\n\nMake sure your IAM permissions allow AWS Marketplace subscriptions so Bedrock can automatically enable the model for you.";
        
        const updateCmd = new UpdateCommand({
          TableName: process.env.PROGRESS_TABLE,
          Key: { userId, testId },
          UpdateExpression: "SET aiAdvice = :a",
          ExpressionAttributeValues: {
            ":a": fallbackAdvice
          }
        });
        await docClient.send(updateCmd);
        continue;
      }

      // For other unexpected errors, throw so it goes to DLQ eventually
      throw error;
    }
  }
};
