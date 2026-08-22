# SAT Prep Platform Architecture

This diagram illustrates the complete AWS serverless architecture, derived directly from your Terraform inventory and configuration files (`main.tf` and `serverless.tf`).

```mermaid
graph TD
    %% Styling
    classDef client fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0f172a
    classDef edge fill:#fff1f2,stroke:#e11d48,stroke-width:2px,color:#0f172a
    classDef compute fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#0f172a
    classDef db fill:#fefce8,stroke:#ca8a04,stroke-width:2px,color:#0f172a
    classDef async fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#0f172a
    classDef auth fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#0f172a
    classDef monitor fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#0f172a

    %% Client Layer
    Browser(fa:fa-desktop Student Browser):::client

    %% AWS Edge & Delivery
    subgraph AWS_Edge["AWS Edge & Delivery"]
        CF[CloudFront CDN]:::edge
        S3[S3 Static Website]:::edge
        ApiGW[API Gateway HTTP]:::edge
    end

    %% AWS Auth
    subgraph AWS_Auth["Authentication"]
        Cognito[Cognito User Pool]:::auth
    end

    %% AWS Compute (Lambdas)
    subgraph AWS_Compute["Lambda Microservices"]
        L_PreSignUp(pre_sign_up):::compute
        L_LogAuth(log_auth):::compute
        L_Dashboard(fetch_dashboard):::compute
        L_SubmitTest(submit_test):::compute
        L_SubmitRev(submit_review):::compute
        L_GetRates(get_ratings):::compute
    end

    %% Async & Scheduled Compute
    subgraph AWS_Async["Async & AI Processing"]
        SQS[[ai_tutor_queue SQS]]:::async
        L_AiTutor(ai_advice):::compute
        Bedrock((Amazon Bedrock Claude)):::async
        EventBridge((Daily Cron EventBridge)):::async
        L_Daily(daily_summary):::compute
        SES[Amazon SES]:::async
    end

    %% Data Persistence (DynamoDB)
    subgraph AWS_Data["DynamoDB Tables"]
        DB_Users[(users)]:::db
        DB_Tests[(tests)]:::db
        DB_Progress[(progress)]:::db
        DB_Activity[(activity_log)]:::db
        DB_Reviews[(reviews)]:::db
        DB_Aggs[(aggregates)]:::db
    end

    %% Monitoring
    subgraph AWS_Monitor["Monitoring & Alarms"]
        CW[CloudWatch Alarms]:::monitor
        SNS((SNS Alerts Topic)):::monitor
        Budget[AWS Budgets]:::monitor
    end

    %% --- Connections ---

    %% Client interactions
    Browser -->|Loads UI| CF
    CF --> S3
    Browser -->|API Requests| ApiGW
    Browser -->|Auth & Registration| Cognito

    %% API Gateway Routing
    ApiGW -.->|JWT Authorizer| Cognito
    ApiGW -->|GET /dashboard| L_Dashboard
    ApiGW -->|POST /submit| L_SubmitTest
    ApiGW -->|POST /reviews| L_SubmitRev
    ApiGW -->|GET /ratings| L_GetRates

    %% Auth Triggers
    Cognito -->|Pre Sign-Up| L_PreSignUp
    Cognito -->|Post Authentication| L_LogAuth

    %% Lambda to DynamoDB (Synchronous Core APIs)
    L_Dashboard -->|Read| DB_Progress
    L_Dashboard -->|Read| DB_Aggs

    L_SubmitTest -->|Write| DB_Tests
    L_SubmitTest -->|Write| DB_Progress
    L_SubmitTest -->|Write| DB_Activity
    L_SubmitTest -->|Update| DB_Aggs

    L_SubmitRev -->|Write| DB_Reviews
    L_SubmitRev -->|Update| DB_Aggs

    L_GetRates -->|Read| DB_Aggs
    L_LogAuth -->|Write| DB_Activity

    %% Async Processing Flow (AI Tutor)
    L_SubmitTest -->|Send Request| SQS
    SQS -->|Triggers| L_AiTutor
    L_AiTutor <-->|Invoke Model| Bedrock
    L_AiTutor -->|Write Feedback| DB_Progress

    %% Scheduled Jobs Flow (Daily Summary)
    EventBridge -->|Triggers @ 8PM EST| L_Daily
    L_Daily -->|Read/Agg| DB_Activity
    L_Daily -->|Read/Agg| DB_Progress
    L_Daily -->|Read Data| S3
    L_Daily -->|Send Email| SES

    %% Monitoring Hooks (Visual abstractions)
    ApiGW -.-> CW
    L_SubmitTest -.-> CW
    Bedrock -.-> CW
    DB_Tests -.-> CW
    CW -->|Threshold Exceeded| SNS
    Budget -->|Cost Exceeded| SNS
```
