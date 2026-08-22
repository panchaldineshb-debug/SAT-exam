import json
import boto3
import os

TABLE_NAME = "sat_tests-1d79949f"
MASTER_JSON_FILE = "data/master_tests.json"
PUBLIC_JSON_FILE = "public/tests_data.json"

def main():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLE_NAME)

    with open(MASTER_JSON_FILE, 'r') as f:
        tests = json.load(f)

    public_tests = []
    
    for test in tests:
        test_id = str(test['id'])
        
        # 1. Prepare secure object for DynamoDB
        secure_questions = []
        public_questions = []
        
        for q in test.get('questions', []):
            # Secure item
            secure_q = {
                "id": str(q['id']),
                "key": q.get('key', ''),
                "explanation": q.get('explanation', ''),
                "tags": q.get('tags', [])
            }
            secure_questions.append(secure_q)
            
            # Public item (strip secure data)
            pub_q = {k: v for k, v in q.items() if k not in ('key', 'explanation', 'tags')}
            public_questions.append(pub_q)
            
        # Write secure test to DynamoDB
        print(f"Uploading answer key for {test_id} to DynamoDB...")
        table.put_item(
            Item={
                'testId': test_id,
                'title': test.get('title', ''),
                'subject': test.get('subject', ''),
                'questions': secure_questions
            }
        )
        
        # Keep public version
        public_test = {k: v for k, v in test.items() if k != 'questions'}
        public_test['questions'] = public_questions
        public_tests.append(public_test)
        
    # Write stripped data to public/tests_data.json
    os.makedirs(os.path.dirname(PUBLIC_JSON_FILE), exist_ok=True)
    with open(PUBLIC_JSON_FILE, 'w') as f:
        json.dump(public_tests, f, indent=2)
        
    print(f"Seeding complete! Public JSON saved to {PUBLIC_JSON_FILE}.")

if __name__ == "__main__":
    main()
