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
