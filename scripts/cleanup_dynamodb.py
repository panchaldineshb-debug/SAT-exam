import boto3

def wipe_table(table_name, key_schema):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(table_name)
    
    print(f"Wiping table {table_name}...")
    
    scan = None
    with table.batch_writer() as batch:
        while scan is None or 'LastEvaluatedKey' in scan:
            if scan is None:
                scan = table.scan()
            else:
                scan = table.scan(ExclusiveStartKey=scan['LastEvaluatedKey'])
                
            for item in scan['Items']:
                # Ensure we only pass the keys
                key_dict = {k: item[k] for k in key_schema}
                batch.delete_item(Key=key_dict)
                
    print(f"Finished wiping {table_name}.")

def main():
    tables_to_wipe = {
        'sat_tests-1d79949f': ['testId'],
        'sat_progress-1d79949f': ['userId', 'testId'],
        'sat_activity_log-1d79949f': ['date', 'timestamp'],
        'sat_aggregates-1d79949f': ['testId'],
        'sat_reviews-1d79949f': ['testId', 'userId']
    }
    
    for t, keys in tables_to_wipe.items():
        try:
            wipe_table(t, keys)
        except Exception as e:
            print(f"Error wiping {t}: {e}")

if __name__ == "__main__":
    main()
