import boto3

def cleanup_e2e_users(user_pool_id):
    client = boto3.client('cognito-idp', region_name='us-east-1')
    
    deleted_count = 0
    paginator = client.get_paginator('list_users')
    
    print(f"Scanning user pool {user_pool_id} for 'e2e_' users...")
    
    for page in paginator.paginate(UserPoolId=user_pool_id):
        for user in page['Users']:
            username = user['Username']
            email = next((attr['Value'] for attr in user.get('Attributes', []) if attr['Name'] == 'email'), "")
            
            if 'e2e_' in username or 'e2e_' in email:
                try:
                    client.admin_delete_user(
                        UserPoolId=user_pool_id,
                        Username=username
                    )
                    print(f"Deleted user: username={username}, email={email}")
                    deleted_count += 1
                except Exception as e:
                    print(f"Failed to delete {username}: {e}")

    print(f"Cleanup complete. Deleted {deleted_count} e2e users.")

if __name__ == "__main__":
    USER_POOL_ID = "us-east-1_smjzCmGcX"
    cleanup_e2e_users(USER_POOL_ID)
