# SAT Prep Application Architecture

This document outlines the highly-optimized, 100% serverless architecture of the SAT Prep Application.

## Architecture Diagram

```mermaid
graph TD
    %% User and Global Edge
    User((User / Browser))
    
    subgraph "AWS Global Edge Network"
        CF[CloudFront CDN]
        S3[S3 Static Website]
    end

    %% Regional Backend
    subgraph "AWS Region (e.g., us-east-1)"
        API[API Gateway]
        
        subgraph "Regional Lambdas"
            L_Auth[pre_sign_up]
            L_Dash[fetch_dashboard]
            L_Test[submit_test]
            L_AI[ai_advice]
        end
        
        subgraph "Managed Services"
            Cognito[AWS Cognito<br/>Auth & Rate Limits]
            DynamoDB[(DynamoDB<br/>NoSQL Tables)]
            Bedrock[Amazon Bedrock<br/>Claude 3 Haiku]
        end
    end

    %% Flow - Static Assets
    User -- "1. Request Site" --> CF
    CF -- "2. Fetch React Assets" --> S3
    
    %% Flow - API Requests
    User -- "3. API Requests" --> API
    API -- "Route: POST /submit" --> L_Test
    API -- "Route: GET /dashboard" --> L_Dash
    API -- "Route: POST /ai-advice" --> L_AI
    
    %% Flow - Backend Logic
    L_Auth --> Cognito
    L_Test --> DynamoDB
    L_Dash --> DynamoDB
    L_AI --> Bedrock
    
    %% Styling
    classDef optimal fill:#d4edda,stroke:#28a745,stroke-width:2px;
    classDef managed fill:#cce5ff,stroke:#004085,stroke-width:2px;
    
    class API,L_Auth,L_Dash,L_Test,L_AI,S3,CF optimal;
    class Cognito,DynamoDB,Bedrock managed;
```

## Architectural Design Principles

> [!TIP]
> **Performance & Cost Efficiency**
> By strictly splitting static delivery and backend compute, we achieve the lowest possible latency and cost. 

1. **CloudFront + S3 (Static Hosting):** React files are cached globally at Edge locations. The user's browser downloads the UI instantly, completely bypassing compute costs.
2. **API Gateway + Regional Lambdas (Compute):** API requests go directly to our regional backend. Regional Lambdas execute fast, share a single cold-start pool per region, and operate comfortably within the 1 million free requests/month tier.
3. **Managed Services (Data & Auth):** DynamoDB and Cognito handle state securely at scale without any infrastructure maintenance.
4. **AI Integration:** Amazon Bedrock (Claude 3 Haiku) provides cost-effective, high-speed Socratic tutoring directly via Serverless Lambda integration.

## Deployment Architecture

This section outlines how infrastructure and application code are automatically compiled, packaged, and deployed via Terraform and Make, ensuring a strict Infrastructure as Code (IaC) methodology.

```mermaid
graph TD
    %% Roles and Environments
    Developer((Developer))
    
    subgraph "Build Automation"
        Make[Makefile]
        Vite[Vite Bundler]
        Packager[Zip Packager]
        TF_CLI[Terraform CLI]
    end

    subgraph "AWS Deployment Targets"
        subgraph "Terraform Environments"
            Env_Demo[Demo Environment]
            Env_Prod[Prod Environment]
        end
        TF_State[(Terraform State)]
    end

    %% Deployment Flow
    Developer -- "make deploy-demo" --> Make
    
    Make -- "1. Build Frontend" --> Vite
    Make -- "2. Package Backend" --> Packager
    Make -- "3. Plan & Apply" --> TF_CLI
    
    TF_CLI -- "Reads/Writes" --> TF_State
    TF_CLI -- "Provisions Infrastructure" --> Env_Demo
    Vite -- "4. Syncs Static Assets" --> Env_Demo
    
    %% Styling
    classDef dev fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#0f172a;
    classDef tool fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0f172a;
    classDef target fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#0f172a;
    classDef state fill:#fefce8,stroke:#ca8a04,stroke-width:2px,color:#0f172a;
    
    class Developer dev;
    class Make,Vite,Packager,TF_CLI tool;
    class Env_Demo,Env_Prod target;
    class TF_State state;
```

### Deployment Strategy

> [!NOTE]
> **Environment Separation**
> The deployment pipeline utilizes isolated environments (like `demo` and `prod`) allowing safe testing of infrastructure changes before they impact real users.

1. **Makefile Orchestration:** A centralized `Makefile` orchestrates the entire build and deployment lifecycle (e.g., `make deploy-demo`).
2. **Asset Compilation & Packaging:** 
   * The frontend React application is aggressively bundled and minified using Vite for lightning-fast delivery.
   * Backend Node.js Lambdas are zipped into isolated deployment artifacts, ensuring small footprint and fast cold starts.
3. **Infrastructure as Code (IaC):** Terraform evaluates the `serverless.tf` configurations, compares them against the remote state, and automatically provisions or updates the API Gateway, Cognito User Pools, DynamoDB Tables, SQS Queues, and CloudWatch Alarms.
4. **Static Sync:** Finally, the compiled frontend assets are synchronized directly to the newly provisioned S3 bucket, updating the CloudFront Edge CDN.
