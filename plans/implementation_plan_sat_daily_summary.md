# Track Student SAT Journey (Fully Automated Cloud Solution)

Based on your requirement for a brutally honest, 100% Free-Tier guaranteed setup, we have already fixed the DynamoDB tables to use Provisioned capacity. 

Now, we will implement **Option B**, a fully automated serverless pipeline that tracks student activity and emails you daily without you having to lift a finger or keep your Mac turned on.

## Proposed Changes

We will introduce a purely serverless reporting pipeline using AWS Cognito, DynamoDB, Lambda, EventBridge, and SES.

### 1. Data Capture (Logging Activity)
We will create a new DynamoDB table `sat_activity_log` (Provisioned at 1 RCU/1 WCU for 100% free tier coverage) to track all events.
- **Logins**: We will create a new Lambda function (`sat_log_auth`) and attach it to the Cognito **Post Authentication** trigger. It will write an entry to `sat_activity_log` every time a student logs in.
- **Tests**: We will modify your existing `submit_test` Lambda to also write an entry to `sat_activity_log` when a student finishes a test.

### 2. Daily Summary Generation (AWS EventBridge + Lambda)
- We will create a new Lambda function (`sat_daily_summary`).
- We will attach an **EventBridge Cron Rule** to trigger this Lambda every night at `8:00 PM EST` (`cron(0 0 * * ? *)`).
- The Lambda will scan the `sat_activity_log` for the past 24 hours, generate a clean HTML summary report ("3 students logged in today. Student finished Practice Test 1 with a score of 1450"), and send it to you.

### 3. Email Delivery (Amazon SES)
- The Lambda will use the AWS SDK to send the email via Amazon Simple Email Service (SES). 

---

> [!WARNING]
> **User Review Required: SES Verification**
> Before SES can send emails to you, AWS requires you to verify your email address to prevent spam. 
> I will add a Terraform resource for SES identity verification. When we run `make tf-create-demo`, AWS will send an automated verification email to **panchaldineshb@gmail.com**. You **MUST** click the link in that email, or the nightly summaries will silently fail to send!

If this architecture and the SES verification step sound good to you, click **Proceed** and I will start writing the Terraform and Lambda code!
