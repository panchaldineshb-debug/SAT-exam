import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sqsClient = new SQSClient({});

export const handler = async (event) => {
  try {
    const authorizer = event.requestContext?.authorizer || {};
    const claims = authorizer.jwt?.claims || authorizer.claims || {};
    const userId = claims.sub;
    const email = claims.email || userId;
    const body = JSON.parse(event.body);
    let { testId, answers } = body; // answers is an object: { questionId: "A" }
    testId = String(testId);

    if (!testId || !answers) {
      console.log("Missing testId or answers", body);
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "testId and answers are required" }),
      };
    }
    console.log("Received testId:", testId, "typeof:", typeof testId);

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
    let score = 0;
    const totalQuestions = testItem.questions.length;
    const gradedAnswers = {};
    const incorrectTopics = [];
    let incorrectTags = [];

    testItem.questions.forEach((q) => {
      const chosen = answers[q.id];
      const correctKey = q.key.trim().toLowerCase().replace(/,/g, '');
      const normChosen = chosen ? chosen.trim().toLowerCase().replace(/,/g, '') : '';
      
      const isCorrect = normChosen === correctKey;
      if (isCorrect) score += 1;
      else {
        incorrectTopics.push(q.topic || `Question ${q.id}`);
        if (q.tags && Array.isArray(q.tags)) {
          incorrectTags.push(...q.tags);
        }
      }

      gradedAnswers[q.id] = {
        chosen: chosen || null,
        correctKey: q.key,
        isCorrect: isCorrect,
        explanation: q.explanation || null
      };
    });

    // Mock Scaling Logic (400 - 1600)
    // 400 is base score, 1200 is max earned points
    const percentage = totalQuestions > 0 ? (score / totalQuestions) : 0;
    const rawScaledScore = 400 + (percentage * 1200);
    // Round to nearest 10
    const scaledScore = Math.round(rawScaledScore / 10) * 10;

    // 2. Save the result to User Progress table
    const dateStr = new Date().toLocaleDateString();
    
    const putProgressCmd = new PutCommand({
      TableName: process.env.PROGRESS_TABLE,
      Item: {
        userId: userId,
        testId: testId,
        status: "COMPLETED",
        score: score,
        scaledScore: scaledScore,
        totalQuestions: totalQuestions,
        answers: answers,
        gradedAnswers: gradedAnswers,
        completedAt: new Date().toISOString(),
        date: dateStr
      },
    });
    
    await docClient.send(putProgressCmd);

    // 3. Update Global Aggregate for Percentile Tracking
    if (process.env.AGGREGATES_TABLE) {
      try {
        const updateAggCmd = new UpdateCommand({
          TableName: process.env.AGGREGATES_TABLE,
          Key: { testId: "SAT_GLOBAL_SCORES" },
          UpdateExpression: "ADD totalScaledScore :s, testCount :c",
          ExpressionAttributeValues: {
            ":s": scaledScore,
            ":c": 1
          }
        });
        await docClient.send(updateAggCmd);
      } catch (aggErr) {
        console.error("Failed to update aggregate scores:", aggErr);
      }
    }

    // 4. Log to Activity Table
    const timestamp = new Date().toISOString();
    if (process.env.ACTIVITY_TABLE) {
      try {
        const putActivityCmd = new PutCommand({
          TableName: process.env.ACTIVITY_TABLE,
          Item: {
            date: timestamp.split("T")[0],
            timestamp: timestamp,
            email: email,
            action: "TEST_COMPLETED",
            details: `User completed test ${testId} with score ${score}/${totalQuestions} (Scaled: ${scaledScore})`
          }
        });
        await docClient.send(putActivityCmd);
      } catch (logErr) {
        console.error("Failed to write to activity log:", logErr);
      }
    }

    // 5. Send to AI Tutor SQS Queue
    if (process.env.AI_TUTOR_QUEUE_URL) {
      try {
        const sqsCmd = new SendMessageCommand({
          QueueUrl: process.env.AI_TUTOR_QUEUE_URL,
          MessageBody: JSON.stringify({
            userId,
            testId,
            score,
            totalQuestions,
            incorrectTopics: incorrectTopics.join(", "),
            incorrectTags: Array.from(new Set(incorrectTags))
          }),
        });
        await sqsClient.send(sqsCmd);
      } catch (sqsErr) {
        console.error("Failed to send message to AI Tutor SQS queue:", sqsErr);
        // We don't fail the submission if AI queue fails
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Test graded successfully",
        score: score,
        scaledScore: scaledScore,
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
