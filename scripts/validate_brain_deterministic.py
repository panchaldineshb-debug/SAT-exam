#!/usr/bin/env python3
"""
Gate 1: Deterministic Validation Checks for SAT Brain Knowledge Wiki.
Verifies YAML Frontmatter Schema, Citation & Cross-Link Integrity, and Section Structure.
Zero LLM reliance; 100% deterministic, programmatic rules.
"""

import sys
import os
import re
import json
import argparse
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml is required. Run .venv/bin/pip install pyyaml")
    sys.exit(1)

REQUIRED_FRONTMATTER_FIELDS = {
    "skill_id": str,
    "domain": str,
    "current_level": str,
    "mastery_score": (float, int),
    "last_evaluated_test_id": (str, int),
    "target_check_risk": str,
    "citations": list,
}

VALID_LEVELS = {"Foundations", "Medium", "Advanced"}
VALID_RISKS = {"High", "Medium", "Low"}
VALID_STATUSES = {"correct", "incorrect"}

REQUIRED_SECTIONS = [
    r"^#\s+Skill Summary",
    r"^##\s+Decoys Defeated vs\. Trapped",
    r"^##\s+Step-by-Step Lesson Breakdown \(Foundations / Medium / Advanced\)",
    r"^##\s+Prescribed Micro-Drill Routines",
]

def load_test_registry(repo_root: Path):
    """Loads authoritative tests from test4.json and data/master_tests.json."""
    registry = {}
    
    # 1. Load test4.json if present
    test4_file = repo_root / "test4.json"
    if test4_file.exists():
        try:
            with open(test4_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                item = data.get("Item", {})
                raw_test_id = item.get("testId", {}).get("S", "4")
                test_keys = [str(raw_test_id), f"test{raw_test_id}"]
                q_list = item.get("questions", {}).get("L", [])
                q_ids = set()
                for q in q_list:
                    qid = q.get("M", {}).get("id", {}).get("S", "")
                    if qid:
                        q_ids.add(qid)
                        q_ids.add(f"q{qid}")
                for tk in test_keys:
                    registry[tk] = q_ids
        except Exception as e:
            print(f"[WARN] Failed to load test4.json: {e}")

    # 2. Load master_tests.json if present
    master_file = repo_root / "data" / "master_tests.json"
    if master_file.exists():
        try:
            with open(master_file, "r", encoding="utf-8") as f:
                tests = json.load(f)
                for t in tests:
                    tid = str(t.get("id", ""))
                    q_ids = set()
                    for q in t.get("questions", []):
                        qid = str(q.get("id", ""))
                        if qid:
                            q_ids.add(qid)
                            q_ids.add(f"q{qid}")
                    registry[tid] = q_ids
                    registry[f"test{tid}"] = q_ids
        except Exception as e:
            print(f"[WARN] Failed to load master_tests.json: {e}")

    return registry

def parse_frontmatter(content: str):
    """Extracts frontmatter YAML and markdown body."""
    if not content.startswith("---"):
        return None, content, "File does not start with YAML frontmatter delimiters ('---')."
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content, "YAML frontmatter is not closed with '---'."
    
    yaml_text = parts[1]
    body = parts[2]
    try:
        data = yaml.safe_load(yaml_text)
        if not isinstance(data, dict):
            return None, body, "Frontmatter does not parse into a key-value mapping."
        return data, body, None
    except Exception as e:
        return None, body, f"YAML parsing error: {e}"

def validate_frontmatter_schema(meta: dict, file_path: Path):
    errors = []
    for field, expected_type in REQUIRED_FRONTMATTER_FIELDS.items():
        if field not in meta:
            errors.append(f"Missing required frontmatter field: '{field}'")
            continue
        val = meta[field]
        if not isinstance(val, expected_type):
            errors.append(f"Field '{field}' expected {expected_type}, got {type(val).__name__}")

    if "current_level" in meta and meta["current_level"] not in VALID_LEVELS:
        errors.append(f"Invalid current_level '{meta['current_level']}'. Allowed: {sorted(list(VALID_LEVELS))}")

    if "mastery_score" in meta:
        score = meta["mastery_score"]
        if not (0.0 <= float(score) <= 1.0):
            errors.append(f"mastery_score {score} out of bounds. Must be between 0.00 and 1.00.")

    if "target_check_risk" in meta and meta["target_check_risk"] not in VALID_RISKS:
        errors.append(f"Invalid target_check_risk '{meta['target_check_risk']}'. Allowed: {sorted(list(VALID_RISKS))}")

    if "citations" in meta and isinstance(meta["citations"], list):
        for idx, cit in enumerate(meta["citations"]):
            if not isinstance(cit, dict):
                errors.append(f"Citation #{idx} must be a dictionary.")
                continue
            for cit_field in ["test_id", "question_id", "status", "decoy_type"]:
                if cit_field not in cit:
                    errors.append(f"Citation #{idx} missing required key '{cit_field}'.")
            if cit.get("status") not in VALID_STATUSES:
                errors.append(f"Citation #{idx} invalid status '{cit.get('status')}'. Allowed: {sorted(list(VALID_STATUSES))}")

    return errors

def validate_citations_and_links(meta: dict, body: str, file_path: Path, registry: dict, repo_root: Path):
    errors = []
    
    # Validate citations against test registry
    if "citations" in meta and isinstance(meta["citations"], list):
        for idx, cit in enumerate(meta["citations"]):
            tid = str(cit.get("test_id", ""))
            qid = str(cit.get("question_id", ""))
            
            # Check test registry
            if registry:
                matched_test = None
                for candidate in [tid, f"test{tid}", tid.replace("test", "")]:
                    if candidate in registry:
                        matched_test = candidate
                        break
                
                if not matched_test:
                    errors.append(f"Citation #{idx} references unknown test_id '{tid}'.")
                else:
                    valid_qs = registry[matched_test]
                    norm_qid = qid.lower()
                    if norm_qid not in valid_qs and f"q{norm_qid}" not in valid_qs and norm_qid.replace("q", "") not in valid_qs:
                        errors.append(f"Citation #{idx} question '{qid}' not found in test '{tid}'. Valid questions: {sorted(list(valid_qs))[:8]}...")

    # Validate internal Markdown links [text](path) or [[skill]]
    # 1. Wiki-style links [[something]]
    wiki_links = re.findall(r"\[\[([^\]]+)\]\]", body)
    for link in wiki_links:
        target_name = link.strip().lower()
        if not target_name.endswith(".md"):
            target_name += ".md"
        # Check if skill file exists
        target_path = repo_root / "brain" / "skills" / target_name
        if not target_path.exists():
            errors.append(f"Broken wiki link: '[[{link}]]'. Target {target_path} not found.")

    # 2. Standard markdown relative links [text](path.md)
    md_links = re.findall(r"\[[^\]]+\]\(([^)]+\.md)\)", body)
    for link in md_links:
        if link.startswith("http://") or link.startswith("https://") or link.startswith("#"):
            continue
        rel_path = (file_path.parent / link).resolve()
        if not rel_path.exists():
            errors.append(f"Broken relative markdown link: '{link}'. Target {rel_path} not found.")

    return errors

def validate_document_sections(body: str):
    errors = []
    for req_sec in REQUIRED_SECTIONS:
        if not re.search(req_sec, body, re.MULTILINE):
            clean_name = req_sec.replace(r"^", "").replace(r"\s+", " ").replace(r"\.", ".").replace(r"\(", "(").replace(r"\)", ")")
            errors.append(f"Missing required section header: '{clean_name}'")
    return errors

def validate_skill_file(file_path: Path, repo_root: Path, registry: dict):
    """Validates a single skill markdown file."""
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return [f"Failed to read file: {e}"]

    meta, body, err = parse_frontmatter(content)
    if err:
        return [err]

    all_errors = []
    all_errors.extend(validate_frontmatter_schema(meta, file_path))
    all_errors.extend(validate_citations_and_links(meta, body, file_path, registry, repo_root))
    all_errors.extend(validate_document_sections(body))

    return all_errors

def main():
    parser = argparse.ArgumentParser(description="Deterministic Gate 1 Validator for SAT Brain Wiki")
    parser.add_argument("--brain-dir", default="brain/skills", help="Path to skills directory")
    parser.add_argument("--file", default=None, help="Specific markdown file to validate")
    parser.add_argument("--repo-root", default=".", help="Root of SAT repository")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    registry = load_test_registry(repo_root)

    files_to_validate = []
    if args.file:
        files_to_validate.append(Path(args.file).resolve())
    else:
        skills_dir = repo_root / args.brain_dir
        if not skills_dir.exists():
            print(f"[FAIL] Skills directory {skills_dir} does not exist.")
            sys.exit(1)
        files_to_validate = sorted(list(skills_dir.glob("*.md")))

    if not files_to_validate:
        print("[WARN] No markdown files found to validate.")
        sys.exit(0)

    total_failures = 0
    print(f"=== GATE 1: Deterministic Validation Checks ===")
    print(f"Targeting {len(files_to_validate)} file(s) across registry with {len(registry)} test suites...\n")

    for fpath in files_to_validate:
        errors = validate_skill_file(fpath, repo_root, registry)
        rel_name = fpath.relative_to(repo_root) if repo_root in fpath.parents else fpath.name
        if errors:
            total_failures += 1
            print(f"❌ [FAIL] {rel_name}")
            for err in errors:
                print(f"    • {err}")
        else:
            print(f"✅ [PASS] {rel_name}")

    print(f"\nGate 1 Result: {len(files_to_validate) - total_failures}/{len(files_to_validate)} files passed.")
    if total_failures > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
