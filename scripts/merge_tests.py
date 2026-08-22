import json

def main():
    master_file = 'data/master_tests.json'
    custom_exam_file = 'data/full-length-sat-paper-practice-test-suite-2026-08-20/exam.json'

    with open(master_file, 'r') as f:
        master_tests = json.load(f)

    with open(custom_exam_file, 'r') as f:
        custom_tests = json.load(f)

    # Append custom tests
    master_tests.extend(custom_tests)

    # Save back
    with open(master_file, 'w', encoding='utf-8') as f:
        json.dump(master_tests, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully merged {len(custom_tests)} custom tests into {master_file}.")
    print(f"Total tests in master dataset: {len(master_tests)}")

if __name__ == '__main__':
    main()
