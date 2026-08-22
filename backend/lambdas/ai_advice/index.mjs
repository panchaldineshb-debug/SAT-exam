import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const authorizer = event.requestContext?.authorizer || {};
    const claims = authorizer.jwt?.claims || authorizer.claims || {};
    const userId = claims.sub;
    
    if (!userId) {
      return { 
        statusCode: 401, 
        headers: { "Access-Control-Allow-Origin": "*" }, 
        body: JSON.stringify({ message: "Unauthorized" }) 
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { score, totalQuestions, incorrectTopics } = body;

    const promptText = `You are an expert SAT tutor. The student just took a practice test.
They scored ${score} out of ${totalQuestions}.
They struggled with these topics or questions:
${incorrectTopics || "General errors"}

Please provide 2-3 short, encouraging paragraphs of study advice. Be direct, supportive, and give actionable next steps.`;

    const input = {
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
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

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const adviceText = responseBody.content[0].text;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        advice: adviceText
      }),
    };
  } catch (error) {
    console.error("Error generating AI advice:", error);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ 
        advice: "The AI Tutor is thinking too hard right now (timeout or rate limit). Please try again in a moment!"
      }),
    };
  }
};
