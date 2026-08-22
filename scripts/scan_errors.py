import boto3
import json

TABLE_NAME = "sat_tests-1d79949f"
JSON_FILE = "public/tests_data.json"

def scan_errors():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLE_NAME)

    # 1. Load subjects from local json
    with open(JSON_FILE, 'r') as f:
        tests = json.load(f)
    
    subject_map = {str(t['id']): t['subject'] for t in tests}

    # 2. Fetch all from DynamoDB
    response = table.scan()
    items = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))

    anomalies = []
    
    for item in items:
        test_id = item['testId']
        subject = subject_map.get(test_id, 'unknown')
        questions = item.get('questions', [])
        
        for q_index, q in enumerate(questions):
            q_id = q.get('id')
            key = q.get('key', '')
            explanation = q.get('explanation', '')
            
            is_anomaly = False
            reason = []
            
            # Heuristic 1: Verbal question with a numeric key
            if subject == 'verbal':
                if key.strip().replace('.', '').replace('-', '').replace('/', '').isdigit():
                    is_anomaly = True
                    reason.append("Numeric key found for a verbal question")
                
                # Heuristic 2: Math words in verbal explanation
                math_words = ["equation", "subtracting", "dividing", "yields", "solution to the given equation", "data value", "graph"]
                found_math = [w for w in math_words if w.lower() in explanation.lower()]
                if found_math:
                    is_anomaly = True
                    reason.append(f"Math words found in verbal explanation: {found_math}")
                    
            elif subject == 'math':
                # Heuristic 3: Verbal words in math explanation
                verbal_words = ["participial", "clause", "pronoun", "comma", "colon", "semicolon", "grammatical", "noun", "verb"]
                found_verbal = [w for w in verbal_words if w.lower() in explanation.lower()]
                if found_verbal:
                    is_anomaly = True
                    reason.append(f"Verbal/grammar words found in math explanation: {found_verbal}")
            
            if is_anomaly:
                anomalies.append({
                    "testId": test_id,
                    "questionId": q_id,
                    "questionIndex": q_index,
                    "subject": subject,
                    "key": key,
                    "reasons": reason,
                    "explanation": explanation
                })

    # Output to JSON
    with open("scan_results.json", "w") as f:
        json.dump(anomalies, f, indent=2)

if __name__ == "__main__":
    scan_errors()
