#!/usr/bin/env python3
"""
Question Normalizer & Trusted Record Adapter for SAT Brain.
Loads and indexes canonical questions from data/master_tests.json and test4.json.
Provides standardized, grounded question records with canonical answer keys and vetted explanations.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, Any, Optional, List

REPO_ROOT = Path(__file__).resolve().parent.parent

class QuestionNormalizer:
    """Normalizes and indexes trusted SAT question records."""

    def __init__(self, repo_root: Optional[Path] = None):
        self.repo_root = repo_root or REPO_ROOT
        self._index: Dict[str, Dict[str, Any]] = {}
        self._load_all()

    def _load_all(self):
        """Loads and indexes questions from all trusted repositories."""
        self._load_master_tests()
        self._load_dynamo_test4()

    def _normalize_key(self, raw_key: str) -> str:
        """Standardizes a question key / answer string."""
        if not raw_key:
            return ""
        return str(raw_key).strip()

    def _load_master_tests(self):
        master_file = self.repo_root / "data" / "master_tests.json"
        if not master_file.exists():
            return

        try:
            with open(master_file, "r", encoding="utf-8") as f:
                tests = json.load(f)
        except Exception as e:
            print(f"[WARN] Failed to load {master_file}: {e}")
            return

        for t in tests:
            test_id = str(t.get("id", "")).strip()
            subject = t.get("subject", "math" if "math" in test_id else "verbal")
            test_title = t.get("title", "")

            for q in t.get("questions", []):
                qid = str(q.get("id", "")).strip()
                global_id = str(q.get("globalId", "")).strip() if q.get("globalId") is not None else None
                key = self._normalize_key(q.get("key", ""))
                explanation = str(q.get("explanation") or "").strip()
                prompt = str(q.get("prompt") or "").strip()
                passage = str(q.get("passage") or "").strip()
                options = q.get("options", [])
                topic = q.get("topic") or (
                    "Reading & Writing / Information & Ideas" if subject == "verbal" else "Algebra / Advanced Math"
                )

                record = {
                    "questionId": f"{test_id}:{qid}",
                    "testId": test_id,
                    "itemNumber": qid,
                    "globalId": global_id,
                    "prompt": prompt,
                    "passage": passage,
                    "options": options,
                    "canonicalAnswer": key,
                    "explanation": explanation,
                    "subject": subject,
                    "topic": topic,
                    "domain": subject.capitalize(),
                    "source": "canonical_question_bank",
                }

                # Index by several standard lookup formats:
                # 1. "testId:qid" (e.g. "verbal-1:1", "math-1:5")
                self._index[f"{test_id}:{qid}"] = record
                self._index[f"{test_id}:q{qid}"] = record

                # If testId has format "verbal-1", also allow "testverbal-1:1" or "verbal1:1"
                self._index[f"test-{test_id}:{qid}"] = record
                compact_test_id = test_id.replace("-", "")
                self._index[f"{compact_test_id}:{qid}"] = record

                # If test is purely numeric in name (e.g. test4)
                if test_id.startswith("math-"):
                    num = test_id.replace("math-", "")
                    self._index[f"math{num}:{qid}"] = record
                    self._index[f"test{num}:{qid}"] = record
                elif test_id.startswith("verbal-"):
                    num = test_id.replace("verbal-", "")
                    self._index[f"verbal{num}:{qid}"] = record

                # 2. Index by globalId if present
                if global_id:
                    self._index[f"{test_id}:gid:{global_id}"] = record
                    if f"global:{global_id}" not in self._index:
                        self._index[f"global:{global_id}"] = record
                        self._index[f"gid:{global_id}"] = record

    def _load_dynamo_test4(self):
        """Loads DynamoDB export test4.json if available."""
        test4_file = self.repo_root / "test4.json"
        if not test4_file.exists():
            return

        try:
            with open(test4_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            item = data.get("Item", {})
            tid = item.get("testId", {}).get("S", "4")
            for q in item.get("questions", {}).get("L", []):
                m = q.get("M", {})
                qid = m.get("id", {}).get("S", "")
                key = m.get("key", {}).get("S", "")
                exp = m.get("explanation", {}).get("S", "")
                lookup_key = f"test{tid}:{qid}"
                if lookup_key not in self._index:
                    record = {
                        "questionId": lookup_key,
                        "testId": f"test{tid}",
                        "itemNumber": qid,
                        "globalId": None,
                        "prompt": m.get("prompt", {}).get("S", ""),
                        "passage": "",
                        "options": [opt.get("S", "") for opt in m.get("options", {}).get("L", [])],
                        "canonicalAnswer": self._normalize_key(key),
                        "explanation": exp,
                        "subject": "math",
                        "topic": "Algebra / Advanced Math",
                        "domain": "Math",
                        "source": "canonical_question_bank",
                    }
                    self._index[lookup_key] = record
                    self._index[f"{tid}:{qid}"] = record
        except Exception as e:
            print(f"[WARN] Failed to load {test4_file}: {e}")

    def get_question(self, question_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves normalized question record by ID.
        Supports:
          - "verbal-1:1"
          - "math-1:5"
          - "test4:7"
          - "global:12"
          - "math-1:q5"
        """
        if not question_id or not isinstance(question_id, str):
            return None

        clean_id = question_id.strip()

        # Direct hit
        if clean_id in self._index:
            return self._index[clean_id]

        # Lowercase check
        lower_id = clean_id.lower()
        if lower_id in self._index:
            return self._index[lower_id]

        # Case-insensitive scan
        for k, rec in self._index.items():
            if k.lower() == lower_id:
                return rec

        # Handle simple global ID number as string
        if clean_id.isdigit():
            global_key = f"global:{clean_id}"
            if global_key in self._index:
                return self._index[global_key]

        return None

    def list_indexed_count(self) -> int:
        # Return count of unique questions (distinct record references)
        unique_ids = {id(rec) for rec in self._index.values()}
        return len(unique_ids)

if __name__ == "__main__":
    normalizer = QuestionNormalizer()
    print(f"Loaded {normalizer.list_indexed_count()} unique canonical questions.")
    sample = normalizer.get_question("verbal-1:1")
    if sample:
        print(f"Sample verbal-1:1: Canonical Answer = {sample['canonicalAnswer']}")
        print(f"Explanation prefix: {sample['explanation'][:80]}...")
    math_sample = normalizer.get_question("math-1:1")
    if math_sample:
        print(f"Sample math-1:1: Canonical Answer = {math_sample['canonicalAnswer']}")
