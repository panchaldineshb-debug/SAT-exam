# Scaling to 10,000+ Concurrent Students

If your platform suddenly receives 10,000 students actively taking the SAT and interacting with the system simultaneously, the current serverless architecture will handle parts of it effortlessly, but will hit **hard AWS account quotas** in other areas. 

Because we designed this as a completely Serverless app, the servers won't "crash" (no servers to run out of memory or CPU). Instead, AWS will return `429 Too Many Requests` (Throttling) when quotas are exceeded.

Here is exactly what happens at 10,000 concurrent users and what you must do to support it:

---

## ✅ What Will Survive Effortlessly

1.  **The Frontend (CloudFront & S3):**
    *   **Status:** Perfect.
    *   **Why:** CloudFront is a global CDN designed to handle millions of requests per second. Serving the React app to 10,000 students will not even register as a blip.
2.  **The Database (DynamoDB On-Demand):**
    *   **Status:** Perfect (mostly).
    *   **Why:** Since we just switched to `PAY_PER_REQUEST`, DynamoDB can burst up to 40,000 reads/writes per second by default. As long as the traffic ramps up over a few minutes rather than instantly jumping from 0 to 10,000 in a single millisecond, the database will handle it flawlessly.

---

## ⚠️ What Will Break (AWS Quotas to Increase)

### 1. AWS Lambda Concurrency Limit
*   **The Problem:** By default, every new AWS account is hard-capped at **1,000 concurrent Lambda executions** per region. If 10,000 students click "Submit Test" at the exact same moment, AWS will throttle 9,000 of them.
*   **The Fix:** You must open an AWS Support ticket to request a "Service Quota Increase" for **Lambda Concurrent Executions** to at least `10,000`. This is free to request.

### 2. Amazon Cognito Sign-Up Rate Limits
*   **The Problem:** Once logged in, Cognito scales incredibly well. However, the `SignUp` API is limited to **50 requests per second**. If 10,000 students try to create an account at the exact same time (like at the start of a class period), most will see an error.
*   **The Fix:** You must request a quota increase for **Cognito UserPools Create User API Rate** if you expect mass simultaneous sign-ups.

### 3. Amazon Bedrock (AI Tutor) Limits
*   **The Problem:** Bedrock has strict default limits for Claude 3 Haiku (typically around ~100 to 400 requests per minute). If 10,000 students ask for AI advice simultaneously, almost all of them will hit the `ThrottlingException`. (We added a fallback so the app won't crash, but they won't get their AI advice).
*   **The Fix (Two Options):**
    1.  *Option A (Free):* Request a Bedrock quota increase for `InvokeModel` requests per minute for Claude 3 Haiku.
    2.  *Option B (Architectural Change):* Introduce an **SQS Queue** for the AI Tutor. Instead of waiting live, the app tells the student "Generating your AI advice..." while a backend worker slowly processes the queue within the AWS rate limits.

---

## 💰 The Cost Impact
At 10,000 active students per day, your **$100/month budget will definitely be exceeded**. 
While DynamoDB and Lambda are cheap, 10,000 students calling Bedrock (AI) frequently or generating heavy API Gateway traffic will likely push your monthly bill into the hundreds or low thousands of dollars. You would need to re-evaluate your budget threshold before a launch of this scale.
