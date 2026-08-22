import os
import re
import json
import sys

def parse_bundle(bundle_dir):
    test_file = os.path.join(bundle_dir, 'practice-test.md')
    answers_file = os.path.join(bundle_dir, 'answers.md')
    
    if not os.path.exists(test_file) or not os.path.exists(answers_file):
        print(f"Error: {test_file} or {answers_file} not found.")
        sys.exit(1)
        
    with open(test_file, 'r') as f:
        test_content = f.read()
        
    with open(answers_file, 'r') as f:
        answers_content = f.read()
        
    # Extract answers
    answers = {}
    ans_matches = re.findall(r'^(\d+)\.\s+\*\*([A-D0-9.\-]+)\*\*', answers_content, re.MULTILINE)
    for q_num, ans in ans_matches:
        answers[int(q_num)] = ans

    # Split by section
    sections = re.split(r'^##\s+Section\s+\d+:\s+(.*?)$', test_content, flags=re.MULTILINE)
    
    exam_data = []
    
    global_id = 1
    for i in range(1, len(sections), 2):
        section_name = sections[i].strip()
        section_content = sections[i+1]
        
        subject = 'verbal' if 'Reading' in section_name else 'math'
        
        bundle_basename = os.path.basename(bundle_dir.strip('/'))
        date_match = re.search(r'\d{4}-\d{2}-\d{2}', bundle_basename)
        date_str = f" ({date_match.group(0)})" if date_match else ""
        
        section_data = {
            "id": f"{bundle_basename}-{subject}",
            "subject": subject,
            "title": f"SAT Practice Test Suite{date_str} - {section_name}",
            "questions": []
        }
        
        # Split by question
        questions = re.split(r'^###\s+Question\s+(\d+)$', section_content, flags=re.MULTILINE)
        
        for j in range(1, len(questions), 2):
            q_num = int(questions[j])
            q_content = questions[j+1].strip()
            
            # Clean up trailing section text
            q_content = re.sub(r'\n+---\n+### Grid-In Questions\n*', '', q_content)
            
            # Check if multiple choice or grid in
            if re.search(r'^A\)', q_content, re.MULTILINE):
                options_list = []
                for opt in ['A', 'B', 'C', 'D']:
                    next_opt = chr(ord(opt) + 1) if opt != 'D' else r'\Z'
                    regex = fr'^{opt}\)\s+(.*?)(?=^{next_opt}\)|\Z)'
                    match = re.search(regex, q_content, re.MULTILINE | re.DOTALL)
                    if match:
                        options_list.append(f"{opt}. {match.group(1).strip()}")
                
                prompt_content = re.split(r'^A\)', q_content, flags=re.MULTILINE)[0].strip()
            else:
                options_list = []
                prompt_content = q_content
            
            # Extract texts if present (Text 1, Text 2)
            texts = []
            text_matches = re.finditer(r'\*\*Text\s+\d+\*\*\n(.*?)(?=\n\*\*Text|\nBased on|\Z)', prompt_content, re.DOTALL)
            for tm in text_matches:
                texts.append(tm.group(1).strip())
                
            if texts:
                prompt = re.sub(r'\*\*Text\s+\d+\*\*\n(.*?)(?=\n\*\*Text|\nBased on|\Z)', '', prompt_content, flags=re.DOTALL).strip()
            else:
                prompt = prompt_content
                
            # Extract tags if present
            tag_match = re.search(r'Tags:\s*(.+)', q_content, re.IGNORECASE)
            tags_list = [t.strip() for t in tag_match.group(1).split(',')] if tag_match else []
            prompt = re.sub(r'Tags:\s*(.+)', '', prompt, flags=re.IGNORECASE).strip()
                
            question_data = {
                "id": q_num,
                "globalId": global_id,
                "passage": "\n\n".join(texts) if texts else None,
                "prompt": prompt,
                "options": options_list,
                "key": answers.get(q_num),
                "tags": tags_list
            }
                
            section_data["questions"].append(question_data)
            global_id += 1
            
        exam_data.append(section_data)
        
    output_file = os.path.join(bundle_dir, 'exam.json')
    with open(output_file, 'w') as f:
        json.dump(exam_data, f, indent=2)
        
    print(f"Successfully created {output_file}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_bundle(sys.argv[1])
    else:
        print("Usage: python convert_bundle_to_json.py <bundle_directory>")
