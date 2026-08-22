#!/usr/bin/env python3
import boto3
import argparse
import sys

def cleanup_e2e_users(user_pool_id, env_suffix):
    cognito = boto3.client('cognito-idp')
    dynamodb = boto3.client('dynamodb')

    # Find Cognito users matching e2e_*
    users_to_delete = []
    paginator = cognito.get_paginator('list_users')
    for page in paginator.paginate(UserPoolId=user_pool_id):
        for user in page['Users']:
            for attr in user['Attributes']:
                if attr['Name'] == 'email' and attr['Value'].startswith('e2e_'):
                    users_to_delete.append({
                        'Username': user['Username'],
                        'Email': attr['Value']
                    })

    print(f"Found {len(users_to_delete)} E2E users in Cognito.")

    if not users_to_delete:
        print("Nothing to clean up.")
        return

    # Delete from Cognito
    for u in users_to_delete:
        print(f"Deleting user {u['Email']} ({u['Username']}) from Cognito...")
        try:
            cognito.admin_delete_user(
                UserPoolId=user_pool_id,
                Username=u['Username']
            )
        except Exception as e:
            print(f"Failed to delete {u['Username']} from Cognito: {e}")

    # Collect sub/userIds to delete
    user_ids = [u['Username'] for u in users_to_delete]
    emails = [u['Email'] for u in users_to_delete]

    # Delete from DynamoDB
    table_users = f"sat_users-{env_suffix}"
    table_progress = f"sat_progress-{env_suffix}"
    table_activity = f"sat_activity_log-{env_suffix}"
    table_reviews = f"sat_reviews-{env_suffix}"

    print(f"Cleaning up DynamoDB for user IDs: {user_ids}...")

    # 1. Users
    try:
        for uid in user_ids:
            dynamodb.delete_item(TableName=table_users, Key={'userId': {'S': uid}})
    except Exception as e:
        print(f"Error cleaning {table_users}: {e}")

    # 2. Progress
    try:
        scan_pag = dynamodb.get_paginator('scan')
        for page in scan_pag.paginate(TableName=table_progress):
            for item in page.get('Items', []):
                uid = item.get('userId', {}).get('S')
                tid = item.get('testId', {}).get('S')
                if uid in user_ids:
                    dynamodb.delete_item(TableName=table_progress, Key={'userId': {'S': uid}, 'testId': {'S': tid}})
    except Exception as e:
        print(f"Error cleaning {table_progress}: {e}")

    # 3. Reviews
    try:
        scan_pag = dynamodb.get_paginator('scan')
        for page in scan_pag.paginate(TableName=table_reviews):
            for item in page.get('Items', []):
                uid = item.get('userId', {}).get('S')
                tid = item.get('testId', {}).get('S')
                if uid in user_ids:
                    dynamodb.delete_item(TableName=table_reviews, Key={'testId': {'S': tid}, 'userId': {'S': uid}})
    except Exception as e:
        print(f"Error cleaning {table_reviews}: {e}")

    # 4. Activity Log
    try:
        scan_pag = dynamodb.get_paginator('scan')
        for page in scan_pag.paginate(TableName=table_activity):
            for item in page.get('Items', []):
                email = item.get('email', {}).get('S', '')
                date_val = item.get('date', {}).get('S')
                ts_val = item.get('timestamp', {}).get('S')
                if email in emails or email.startswith('e2e_'):
                    dynamodb.delete_item(TableName=table_activity, Key={'date': {'S': date_val}, 'timestamp': {'S': ts_val}})
    except Exception as e:
        print(f"Error cleaning {table_activity}: {e}")

    print("Cleanup complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clean up E2E users.")
    parser.add_argument("--user-pool-id", required=True)
    parser.add_argument("--env-suffix", required=True)
    args = parser.parse_args()

    cleanup_e2e_users(args.user_pool_id, args.env_suffix)
