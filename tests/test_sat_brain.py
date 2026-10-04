import os
import sys
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import pytest

from scripts.validate_brain_deterministic import (
    load_test_registry,
    validate_skill_file,
    validate_frontmatter_schema,
    validate_document_sections,
)
from scripts.validate_brain_semantic import (
    load_catalog_traps,
    load_question_explanations,
    verify_semantic_skill,
)
from scripts.sync_brain import sync_file

REPO_ROOT = Path(__file__).resolve().parent.parent

def test_brain_skills_pass_gate_1_deterministic():
    registry = load_test_registry(REPO_ROOT)
    skills_dir = REPO_ROOT / "brain" / "skills"
    assert skills_dir.exists(), "brain/skills directory must exist"

    skill_files = list(skills_dir.glob("*.md"))
    assert len(skill_files) >= 3, "Expected at least 3 skill markdown files"

    for sf in skill_files:
        errors = validate_skill_file(sf, REPO_ROOT, registry)
        assert errors == [], f"Deterministic validation failed for {sf.name}: {errors}"

def test_brain_skills_pass_gate_2_semantic():
    catalog_path = REPO_ROOT / "brain" / "traps_and_decoys.md"
    traps = load_catalog_traps(catalog_path)
    explanations = load_question_explanations(REPO_ROOT)
    skills_dir = REPO_ROOT / "brain" / "skills"

    for sf in skills_dir.glob("*.md"):
        errors = verify_semantic_skill(sf, None, traps, explanations)
        assert errors == [], f"Semantic validation failed for {sf.name}: {errors}"

def test_gate_1_fails_on_missing_frontmatter():
    bad_meta = {
        "skill_id": "test_skill",
        # Missing domain, current_level, mastery_score, etc.
    }
    errors = validate_frontmatter_schema(bad_meta, Path("dummy.md"))
    assert len(errors) > 0
    assert any("domain" in e for e in errors)

def test_gate_1_fails_on_missing_sections():
    bad_body = "# Skill Summary\n\nSome text without other sections."
    errors = validate_document_sections(bad_body)
    assert len(errors) == 3
    assert any("Decoys Defeated vs. Trapped" in e for e in errors)

def test_gate_2_fails_on_contradictory_progression():
    catalog_path = REPO_ROOT / "brain" / "traps_and_decoys.md"
    traps = load_catalog_traps(catalog_path)
    explanations = load_question_explanations(REPO_ROOT)

    tmp_file = REPO_ROOT / ".brain_staging" / "contradiction_test.md"
    tmp_file.parent.mkdir(parents=True, exist_ok=True)
    tmp_file.write_text(
        "---\n"
        "skill_id: 'test_skill'\n"
        "domain: 'Algebra'\n"
        "current_level: 'Advanced'\n"
        "mastery_score: 0.30\n" # Contradicts Advanced
        "last_evaluated_test_id: 'test4'\n"
        "target_check_risk: 'High'\n"
        "citations: []\n"
        "---\n"
        "# Skill Summary\n",
        encoding="utf-8"
    )

    try:
        errors = verify_semantic_skill(tmp_file, None, traps, explanations)
        assert any("Progression contradiction" in e for e in errors)
    finally:
        if tmp_file.exists():
            tmp_file.unlink()

def test_staging_quarantines_invalid_files():
    staging_dir = REPO_ROOT / ".brain_staging"
    staging_skills = staging_dir / "skills"
    staging_skills.mkdir(parents=True, exist_ok=True)

    invalid_staged = staging_skills / "invalid_temp_skill.md"
    invalid_staged.write_text("This has no frontmatter and no headers.", encoding="utf-8")

    success = sync_file(invalid_staged, REPO_ROOT)
    assert success is False
    assert not invalid_staged.exists()

    quarantine_dir = REPO_ROOT / ".brain_quarantine"
    quarantined = list(quarantine_dir.glob("*_invalid_temp_skill.md"))
    assert len(quarantined) > 0

    # Clean up test quarantined file
    for qf in quarantined:
        qf.unlink()
