# Scaling to 100,000 Students (Cost & Architecture Strategy)

Scaling from 100 to 100,000 concurrent students is a massive jump. With your strict focus on cost efficiency, we must change how the system processes data. At this scale, the goal is **Asynchronous Processing**.

Here is the breakdown of what 100,000 students actually costs, where the bottlenecks are, and the exact architectural changes required to survive it.

---

## 💰 The Cost Reality of 100,000 Students

At 100,000 Monthly Active Users (MAUs), assuming each takes 4 tests a month, here is your estimated monthly AWS bill:

| Service | Scaling Cost Factor | Estimated Cost (100k Users) |
| :--- | :--- | :--- |
| **S3 & CloudFront** | Cached static bandwidth. | ~$15 - $30 / mo |
| **API Gateway** | ~$3.50 per 1 Million requests. | ~$15 / mo |
| **AWS Lambda** | Billed per millisecond of compute. | ~$20 / mo |
| **DynamoDB** | $1.25 per 1M Writes, $0.25 per 1M Reads. | ~$10 / mo |
| **Amazon Cognito** | First 50k MAUs are FREE. Next 50k are $0.0055/user. | **$275 / mo** |
| **Bedrock (AI Tutor)** | Claude 3 Haiku ($0.25/1M in, $1.25/1M out tokens). | **~$450 / mo** |
| **Total Estimate** | | **~$800 / month** |

> [!WARNING]
> Your $100/mo budget will be easily broken. **Cognito** and **Bedrock** become your primary cost drivers at the 100,000 user mark.

---

## 🏗️ Architectural Changes Required

If 100,000 students hit "Submit Test" at the exact same moment, the current synchronous architecture will collapse under AWS Quota limits (Lambda Concurrency limits and Bedrock limits). To fix this without buying expensive "Provisioned Capacity", we must decouple the architecture using **Amazon SQS (Simple Queue Service)**.

### 1. Decouple the AI Tutor (Asynchronous Queue)
Currently, when a student submits a test, the user's browser waits 5-10 seconds for Lambda to call Bedrock (AI Tutor) and return the response. At 100k scale, AWS will rate-limit Bedrock, and thousands of students will get errors.

**The Fix:**
*   When a test is submitted, calculate the score instantly and return the score to the user (takes 50 milliseconds).
*   Send an event to an **SQS Queue** saying: *"Generate AI advice for Test 123"*.
*   A background worker Lambda pulls from the SQS queue slowly, calling Bedrock at a safe speed (e.g., 50 requests per second) to avoid quotas.
*   The UI shows: *"Your AI Tutor is analyzing your test..."* and the student checks back 2 minutes later to see their advice.

### 2. Batching DynamoDB Writes
At 100k scale, you have 100,000 users generating logs, progress updates, and test aggregates. 
*   **The Fix:** Instead of writing to DynamoDB on every single click, use an SQS queue to buffer analytics and activity logs, then write them to DynamoDB in batches of 25. This reduces your DynamoDB write costs by roughly 80%.

### 3. Cognito Migration / Optimization (Cost Protection)
Cognito becomes surprisingly expensive at 100k users ($275+ per month). 
*   **The Fix:** If costs become a problem, you can stop using Cognito and migrate to a custom JWT-based authentication system backed by DynamoDB (which costs pennies), OR strictly prune inactive users after 30 days to keep your MAU count strictly under the free 50,000 tier.

---

## 🚀 Recommended Next Step
If you want to prepare the architecture for this scale today, the most critical step is **Implementing the SQS Queue for the AI Tutor**. This protects Bedrock from crashing and ensures students always get their scores instantly, regardless of how heavy the traffic is.
