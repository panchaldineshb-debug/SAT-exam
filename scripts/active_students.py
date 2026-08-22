#!/usr/bin/env python3
import warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
import boto3
import argparse
import subprocess
from datetime import datetime, timezone

SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:618079239197:realtor-ui-alerts"

def publish_report(subject, body):
    subprocess.run(
        [
            "aws", "sns", "publish",
            "--topic-arn", SNS_TOPIC_ARN,
            "--region", "us-east-1",
            "--subject", subject,
            "--message", body,
        ],
        check=True,
    )

def list_active_students(user_pool_id, notify):
    cognito = boto3.client('cognito-idp', region_name='us-east-1')
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')
    
    pool_details = cognito.describe_user_pool(UserPoolId=user_pool_id)
    pool_name = pool_details['UserPool']['Name']
    env_suffix = pool_name.replace('sat-students-pool-', '')
    
    table_progress = f"sat_progress-{env_suffix}"

    users = []
    paginator = cognito.get_paginator('list_users')
    for page in paginator.paginate(UserPoolId=user_pool_id):
        for user in page['Users']:
            email = "Unknown"
            for attr in user['Attributes']:
                if attr['Name'] == 'email':
                    email = attr['Value']
            
            # Skip e2e test users
            if email.startswith('e2e_'):
                continue
                
            users.append({
                'Username': user['Username'],
                'Email': email,
                'Status': user['UserStatus'],
                'Created': user['UserCreateDate'],
                'LastModified': user['UserLastModifiedDate']
            })
            
    # Sort by LastModified desc
    users.sort(key=lambda x: x['LastModified'], reverse=True)
    
    report_lines = []
    report_lines.append("\n" + "="*80)
    report_lines.append(f"ACTIVE STUDENTS REPORT (Pool: {pool_name})")
    report_lines.append("="*80)
    report_lines.append(f"{'Email':<35} | {'Status':<12} | {'Tests Taken':<11} | {'Last Active'}")
    report_lines.append("-" * 80)
    
    for u in users:
        # Get test count from DynamoDB
        tests_taken = 0
        try:
            res = dynamodb.query(
                TableName=table_progress,
                KeyConditionExpression="userId = :uid",
                ExpressionAttributeValues={":uid": {"S": u['Username']}}
            )
            tests_taken = res['Count']
        except Exception:
            tests_taken = "N/A"
            
        last_active = u['LastModified'].strftime("%Y-%m-%d %H:%M:%S")
        report_lines.append(f"{u['Email']:<35} | {u['Status']:<12} | {str(tests_taken):<11} | {last_active}")
        
    report_lines.append("="*80 + "\n")
    
    report_text = "\n".join(report_lines)
    print(report_text)
    
    if notify:
        subject = f"SAT Exam - Active Students Report"
        publish_report(subject, report_text)
        print(f"Published report to {SNS_TOPIC_ARN}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--user-pool-id", required=True)
    parser.add_argument("--notify", action="store_true", help="Publish the report to SNS")
    args = parser.parse_args()
    list_active_students(args.user_pool_id, args.notify)
