# AWS Inventory & Monthly Cost Estimate

I ran our `tf_inventory.py` script to audit the live AWS environment. We currently have **59 resources** tracked in Terraform for the `demo` environment and **1 live S3 bucket** (the static web host). There are **zero orphaned resources**, which means our infrastructure is completely clean and tracked!

Here is the projected monthly cost if **100 students** use the application heavily (8–10 hours a day). 

## 1. Usage Assumptions
* **Active Students:** 100
* **Usage Time:** 10 hours/day (approx. 200 hours/month per student)
* **Practice Tests:** ~8 tests per student per month (800 total tests)
* **AI Tutor Sessions:** ~20,000 AI queries per month (assuming they ask the AI for help on 15–20 questions per test and do additional practice)
* **Standard API Clicks:** ~200,000 standard requests per month (fetching dashboards, checking history, loading questions)

## 2. Monthly Cost Breakdown

| AWS Service | Estimated Usage | Cost Estimate | Notes |
| :--- | :--- | :--- | :--- |
| **Amazon Bedrock (AI)** | 20,000 requests | **$15.00 - $25.00** | Claude 3 Haiku is very cheap ($0.25/M input tokens). Even heavy usage is extremely affordable. |
| **API Gateway** | 200,000 requests | **$0.20** | $1.00 per 1 million requests. |
| **AWS Lambda** | 220,000 invocations | **$0.00** | Easily fits inside the generous 400,000 GB-seconds Free Tier. |
| **Amazon DynamoDB** | 300,000 reads/writes | **$0.25** | Using On-Demand (Pay-Per-Request) pricing. |
| **Amazon Cognito** | 100 Active Users | **$0.00** | Free tier covers up to 50,000 Monthly Active Users (MAUs). |
| **CloudFront / S3** | 25 GB Data Transfer | **$0.00** | Free tier provides 1 TB of outbound data per month. |
| **AWS Budgets & Alarms** | 4 Alarms, 1 Budget | **$0.40** | $0.10 per CloudWatch Alarm per month. |

### **Total Estimated Monthly Bill: ~$16.00 - $26.00**

> [!TIP]
> **Conclusion:** Your $100/month budget is more than enough for 100 heavily active students! Because this is a **Serverless** application, you only pay for exactly what you use. The only real cost driver is the Anthropic Claude 3 Haiku model via Bedrock.

---

## 3. Critical Scaling Bottleneck (Requires Fix)

While reviewing the infrastructure, I noticed a critical scaling issue that will break the app for 100 concurrent students:

> [!WARNING]
> Your DynamoDB tables are currently set to **`PROVISIONED`** billing mode with **1 Read Capacity Unit (RCU)** and **1 Write Capacity Unit (WCU)**. 
> 
> **What this means:** The database can only handle **1 read and 1 write per second**. If 2 students click "Submit Test" at the exact same second, the database will throttle the request and the app will crash/show an error.

### Recommended Fix:
Since we are using AWS strictly on a budget and our volume fluctuates, we should change all 6 DynamoDB tables in `serverless.tf` to **`PAY_PER_REQUEST`** (On-Demand). 
On-Demand scales infinitely and instantly, and for 200,000 requests a month, it will literally cost pennies.

Let me know if you want me to automatically apply this DynamoDB scaling fix in Terraform before Student starts testing!
