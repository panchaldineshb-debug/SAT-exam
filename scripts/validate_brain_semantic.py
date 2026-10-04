#!/usr/bin/env python3
"""
Gate 2: Semantic Verification Checks for SAT Brain Knowledge Wiki.
Verifies Evidence Grounding, Decoy Taxonomy Alignment, and Progression Consistency.
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

LEVEL_MASTERY_THRESHOLDS = {
    "Foundations": (0.00, 0.85),
    "Medium": (0.60, 0.90),
    "Advanced": (0.75, 1.00),
}

MAX_ALLOWED_MASTERY_DELTA = 0.25

def parse_frontmatter(content: str):
    if not content.startswith("---"):
        return None, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content
    try:
        data = yaml.safe_load(parts[1])
        return data, parts[2]
    except Exception:
        return None, content

def load_catalog_traps(catalog_path: Path):
    """Extracts known trap IDs from brain/traps_and_decoys.md."""
    if not catalog_path.exists():
        return {
            "intermediate_step_trap",
            "sign_flip_trap",
            "rushing_review_buffer_trap",
            "poison_word_trap",
            "extreme_modifier_trap",
            "premature_rounding_trap",
            "negative_sign_ratio_trap",
            "margin_of_error_trap",
            "growth_rate_trap",
        }
    
    text = catalog_path.read_text(encoding="utf-8")
    traps = set(re.findall(r"### `([^`]+)`", text))
    # Also extract any slash-separated aliases like poison_word_trap / extreme_modifier_trap
    expanded = set()
    for t in traps:
        for sub in t.split("/"):
            expanded.add(sub.strip().strip("`"))
    return expanded

def load_question_explanations(repo_root: Path):
    """Maps test_id:question_id -> explanation text."""
    explanations = {}

    test4_file = repo_root / "test4.json"
    if test4_file.exists():
        try:
            with open(test4_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                item = data.get("Item", {})
                tid = item.get("testId", {}).get("S", "4")
                for q in item.get("questions", {}).get("L", []):
                    qid = q.get("M", {}).get("id", {}).get("S", "")
                    exp = q.get("M", {}).get("explanation", {}).get("S", "")
                    for tkey in [tid, f"test{tid}"]:
                        explanations[f"{tkey}:{qid}"] = exp
                        explanations[f"{tkey}:q{qid}"] = exp
        except Exception:
            pass

    master_file = repo_root / "data" / "master_tests.json"
    if master_file.exists():
        try:
            with open(master_file, "r", encoding="utf-8") as f:
                tests = json.load(f)
                for t in tests:
                    tid = str(t.get("id", ""))
                    for q in t.get("questions", []):
                        qid = str(q.get("id", ""))
                        exp = q.get("explanation", "")
                        for tkey in [tid, f"test{tid}"]:
                            explanations[f"{tkey}:{qid}"] = exp
                            explanations[f"{tkey}:q{qid}"] = exp
        except Exception:
            pass

    return explanations

def verify_semantic_skill(file_path: Path, prior_path: Path, catalog_traps: set, explanations: dict):
    errors = []
    content = file_path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(content)
    if not meta:
        return ["Unable to parse frontmatter for semantic verification."]

    level = meta.get("current_level")
    mastery = float(meta.get("mastery_score", 0.0))

    # 1. Progression Consistency: Level vs. Mastery
    if level in LEVEL_MASTERY_THRESHOLDS:
        min_m, max_m = LEVEL_MASTERY_THRESHOLDS[level]
        if not (min_m <= mastery <= max_m):
            errors.append(
                f"Progression contradiction: Level '{level}' inconsistent with mastery_score {mastery:.2f} "
                f"(expected range {min_m:.2f} to {max_m:.2f})."
            )

    # 2. Progression Delta Consistency: Compare against prior state if exists
    if prior_path and prior_path.exists():
        prior_content = prior_path.read_text(encoding="utf-8")
        prior_meta, _ = parse_frontmatter(prior_content)
        if prior_meta and "mastery_score" in prior_meta:
            prior_mastery = float(prior_meta["mastery_score"])
            delta = abs(mastery - prior_mastery)
            if delta > MAX_ALLOWED_MASTERY_DELTA:
                errors.append(
                    f"Erratic mastery progression jump: Delta of {delta:.2f} from prior score {prior_mastery:.2f} "
                    f"to {mastery:.2f} exceeds max allowed threshold ({MAX_ALLOWED_MASTERY_DELTA:.2f})."
                )

    # 3. Decoy Taxonomy Alignment
    citations = meta.get("citations", [])
    for idx, cit in enumerate(citations):
        decoy_type = cit.get("decoy_type", "")
        if decoy_type not in catalog_traps:
            errors.append(
                f"Citation #{idx} uses unaligned decoy_type '{decoy_type}'. "
                f"Must align with traps catalog in traps_and_decoys.md."
            )

        # 4. Evidence Grounding Check
        tid = str(cit.get("test_id", ""))
        qid = str(cit.get("question_id", ""))
        key = f"{tid}:{qid}"
        if key in explanations:
            exp_text = explanations[key].lower()
            # Verify evidence keywords relate to trap
            if decoy_type == "intermediate_step_trap":
                if not any(w in exp_text for w in ["substitut", "solution", "value of", "x", "y", "pair", "step"]):
                    errors.append(f"Citation #{idx} ({key}): Explanation does not ground intermediate_step_trap.")
            elif decoy_type in {"sign_flip_trap", "negative_sign_ratio_trap"}:
                if not any(w in exp_text for w in ["negative", "sign", "shift", "subtract", "minus", "distribut", "down"]):
                    errors.append(f"Citation #{idx} ({key}): Explanation does not ground sign/negative trap.")
            elif decoy_type in {"poison_word_trap", "extreme_modifier_trap"}:
                if not any(w in exp_text for w in ["incorrect", "context", "suggest", "claim", "extreme", "best"]):
                    errors.append(f"Citation #{idx} ({key}): Explanation does not ground reading decoy trap.")

    return errors

def main():
    parser = argparse.ArgumentParser(description="Semantic Gate 2 Validator for SAT Brain Wiki")
    parser.add_argument("--brain-dir", default="brain/skills", help="Path to skills directory")
    parser.add_argument("--file", default=None, help="Specific markdown file to validate")
    parser.add_argument("--prior-file", default=None, help="Prior durable file to check progression delta against")
    parser.add_argument("--repo-root", default=".", help="Root of SAT repository")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    catalog_path = repo_root / "brain" / "traps_and_decoys.md"
    catalog_traps = load_catalog_traps(catalog_path)
    explanations = load_question_explanations(repo_root)

    files_to_validate = []
    if args.file:
        files_to_validate.append((Path(args.file).resolve(), Path(args.prior_file).resolve() if args.prior_file else None))
    else:
        skills_dir = repo_root / args.brain_dir
        if not skills_dir.exists():
            print(f"[FAIL] Skills directory {skills_dir} does not exist.")
            sys.exit(1)
        for f in sorted(list(skills_dir.glob("*.md"))):
            files_to_validate.append((f, None))

    if not files_to_validate:
        print("[WARN] No markdown files found for semantic validation.")
        sys.exit(0)

    total_failures = 0
    print(f"=== GATE 2: Semantic Verification Checks ===")
    print(f"Loaded {len(catalog_traps)} authoritative traps from catalog: {sorted(list(catalog_traps))}\n")

    for fpath, prior in files_to_validate:
        errors = verify_semantic_skill(fpath, prior, catalog_traps, explanations)
        rel_name = fpath.relative_to(repo_root) if repo_root in fpath.parents else fpath.name
        if errors:
            total_failures += 1
            print(f"❌ [FAIL] {rel_name}")
            for err in errors:
                print(f"    • {err}")
        else:
            print(f"✅ [PASS] {rel_name}")

    print(f"\nGate 2 Result: {len(files_to_validate) - total_failures}/{len(files_to_validate)} files passed.")
    if total_failures > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
