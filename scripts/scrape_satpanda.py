import os
import json
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Constants
BASE_URL = "https://satpanda.com"
MAX_WORKERS = 20  # Use 20 concurrent threads for fast scraping

def clean_text(text):
    if not text:
        return ""
    # Replace non-breaking spaces and clean whitespace
    text = text.replace('\xa0', ' ')
    # Normalize spaces
    text = ' '.join(text.split())
    return text

def scrape_question_explanation(subject, q_global_id):
    url = f"{BASE_URL}/sat/{subject}/question-{q_global_id}-answer-and-explanation.html"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            return "Not found", ""
        
        soup = BeautifulSoup(res.text, "html.parser")
        key_element = soup.find(id="key")
        key = key_element.text.strip() if key_element else "Not found"
        
        paragraphs = soup.find_all("p")
        explanation_started = False
        explanation_text = []
        for p in paragraphs:
            if "explanation:" in p.text.lower():
                explanation_started = True
                continue
            if explanation_started:
                # Stop if we hit the navigation links
                if p.find("nav") or p.find("ul", class_="pagination"):
                    break
                explanation_text.append(p.text.strip())
        
        explanation = " ".join(explanation_text)
        return key, explanation
    except Exception as e:
        print(f"Error fetching explanation for {subject} Q{q_global_id}: {e}")
        return "Error", f"Could not load explanation due to error: {e}"

def scrape_single_test(subject, test_id):
    subject_path = "reading-writing" if subject == "verbal" else "math"
    url = f"{BASE_URL}/sat/{subject_path}/test{test_id}.html"
    print(f"Scraping {subject} Test {test_id} from {url}...")
    
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            print(f"Failed to load {subject} Test {test_id} (Status {res.status_code})")
            return None
        
        soup = BeautifulSoup(res.text, "html.parser")
        
        # Get actual test title
        title_element = soup.find("h1", class_="title")
        title = title_element.text.strip() if title_element else f"Digital SAT {subject.capitalize()} Test {test_id}"
        
        items = soup.find_all("div", class_="myitem")
        questions = []
        
        for idx, item in enumerate(items, 1):
            # Calculate global question ID
            # In SatPanda: Test 1 has Q1-10, Test 2 has Q11-20, etc.
            q_global_id = (test_id - 1) * 10 + idx
            
            # Extract question text paragraphs (ignoring the question number itself)
            paragraphs = [p.text.strip() for p in item.find_all("p") if not p.get('class') or 'nop' not in p.get('class')]
            # Filter out any paragraph that is just the question number
            paragraphs = [p for p in paragraphs if p and not p.isdigit()]
            
            # Parse passage and prompt
            if subject == "verbal":
                if len(paragraphs) > 1:
                    prompt = paragraphs[-1]
                    passage = "\n\n".join(paragraphs[:-1])
                else:
                    prompt = paragraphs[0] if paragraphs else ""
                    passage = ""
            else:
                # Math
                prompt = "\n\n".join(paragraphs)
                passage = ""
            
            # Extract options
            options = [lbl.text.strip() for lbl in item.find_all("label", class_="form-check-label")]
            
            # Fetch answer key and explanation
            key, explanation = scrape_question_explanation(subject_path, q_global_id)
            
            questions.append({
                "id": idx,
                "globalId": q_global_id,
                "passage": clean_text(passage),
                "prompt": clean_text(prompt),
                "options": [clean_text(opt) for opt in options],
                "key": clean_text(key),
                "explanation": clean_text(explanation)
            })
            
        return {
            "id": test_id,
            "subject": subject,
            "title": clean_text(title),
            "questions": questions
        }
        
    except Exception as e:
        print(f"Error scraping {subject} Test {test_id}: {e}")
        return None

def main():
    start_time = time.time()
    all_tests = []
    
    # We will scrape:
    # - Verbal: Tests 1 to 35
    # - Math: Tests 1 to 30
    tasks = []
    
    # Add verbal tests
    for test_id in range(1, 36):
        tasks.append(("verbal", test_id))
    
    # Add math tests
    for test_id in range(1, 31):
        tasks.append(("math", test_id))
        
    print(f"Starting concurrent scraping of {len(tasks)} tests using {MAX_WORKERS} threads...")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all tasks
        future_to_task = {
            executor.submit(scrape_single_test, subject, test_id): (subject, test_id) 
            for subject, test_id in tasks
        }
        
        # Collect results as they finish
        for future in as_completed(future_to_task):
            subject, test_id = future_to_task[future]
            try:
                result = future.result()
                if result:
                    all_tests.append(result)
                    print(f"Completed {subject} Test {test_id} successfully.")
                else:
                    print(f"Failed to scrape {subject} Test {test_id}.")
            except Exception as e:
                print(f"Exception occurred for {subject} Test {test_id}: {e}")
                
    # Sort tests by subject and then ID to make the JSON clean
    # Subject: verbal first, then math. ID: ascending.
    all_tests.sort(key=lambda t: (0 if t["subject"] == "verbal" else 1, t["id"]))
    
    # Write to public/tests_data.json
    # Create the directory structure if it doesn't exist (inside the workspace)
    os.makedirs("public", exist_ok=True)
    out_path = "public/tests_data.json"
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_tests, f, indent=2, ensure_ascii=False)
        
    end_time = time.time()
    elapsed = end_time - start_time
    print(f"\nScraping complete!")
    print(f"Scraped {len(all_tests)} tests ({len(all_tests)*10} questions total).")
    print(f"Output saved to {out_path}")
    print(f"Total time elapsed: {elapsed:.2f} seconds.")

if __name__ == "__main__":
    main()
