#!/usr/bin/env python3
"""
Staging & Sync Engine for SAT Brain Knowledge Wiki.
Enforces Dual Verification Gates (Deterministic Gate 1 & Semantic Gate 2).
Performs Controlled Atomic Promotion, Quarantine on Failure, and Appends to changelog.md.
"""

import sys
import os
import shutil
import difflib
import argparse
from datetime import datetime, timezone
from pathlib import Path

try:
    from scripts.validate_brain_deterministic import (
        load_test_registry,
        validate_skill_file,
    )
    from scripts.validate_brain_semantic import (
        load_catalog_traps,
        load_question_explanations,
        verify_semantic_skill,
        parse_frontmatter,
    )
except ImportError:
    from validate_brain_deterministic import (
        load_test_registry,
        validate_skill_file,
    )
    from validate_brain_semantic import (
        load_catalog_traps,
        load_question_explanations,
        verify_semantic_skill,
        parse_frontmatter,
    )

def run_dual_verification(staged_file: Path, durable_file: Path, repo_root: Path):
    registry = load_test_registry(repo_root)
    catalog = load_catalog_traps(repo_root / "brain" / "traps_and_decoys.md")
    explanations = load_question_explanations(repo_root)

    # Gate 1: Deterministic
    g1_errors = validate_skill_file(staged_file, repo_root, registry)
    
    # Gate 2: Semantic
    g2_errors = verify_semantic_skill(staged_file, durable_file, catalog, explanations)

    return g1_errors, g2_errors

def generate_diff_summary(durable_path: Path, staged_path: Path):
    durable_content = durable_path.read_text(encoding="utf-8") if durable_path.exists() else ""
    staged_content = staged_path.read_text(encoding="utf-8")

    durable_meta, _ = parse_frontmatter(durable_content) if durable_content else (None, "")
    staged_meta, _ = parse_frontmatter(staged_content)

    delta_notes = []
    if durable_meta and staged_meta:
        old_m = durable_meta.get("mastery_score")
        new_m = staged_meta.get("mastery_score")
        if old_m != new_m:
            delta_notes.append(f"Mastery adjusted from {old_m} -> {new_m}")

        old_lvl = durable_meta.get("current_level")
        new_lvl = staged_meta.get("current_level")
        if old_lvl != new_lvl:
            delta_notes.append(f"Level updated from {old_lvl} -> {new_lvl}")

    # Citations delta
    traps_defeated = []
    traps_missed = []
    if staged_meta:
        for cit in staged_meta.get("citations", []):
            qid = cit.get("question_id")
            dtype = cit.get("decoy_type")
            status = cit.get("status")
            if status == "correct":
                traps_defeated.append(f"q{qid} ({dtype} defeated)")
            else:
                traps_missed.append(f"q{qid} ({dtype} missed)")

    return delta_notes, traps_defeated, traps_missed

def append_to_changelog(changelog_path: Path, trigger: str, file_rel: str, delta_notes: list, traps_defeated: list, traps_missed: list, next_action: str):
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    lines = [
        f"\n## Sync Event: {timestamp} [Trigger: {trigger}]",
        "- **Validation**: Deterministic (PASS), Semantic (PASS)",
        f"- **Modified**: `{file_rel}`",
    ]

    for d in delta_notes:
        lines.append(f"  - Delta: {d}")
    if traps_defeated:
        lines.append(f"  - Traps Defeated: {', '.join(traps_defeated)}")
    if traps_missed:
        lines.append(f"  - Traps Missed: {', '.join(traps_missed)}")
    lines.append(f"- **Next Action**: {next_action}")
    lines.append("")

    with open(changelog_path, "a", encoding="utf-8") as f:
        f.write("\n".join(lines))

def sync_file(staged_file: Path, repo_root: Path, trigger: str = "submit_test", next_action: str = "Continue targeted micro-drills."):
    brain_dir = repo_root / "brain"
    staging_dir = repo_root / ".brain_staging"
    quarantine_dir = repo_root / ".brain_quarantine"
    quarantine_dir.mkdir(parents=True, exist_ok=True)

    rel_path = staged_file.relative_to(staging_dir)
    target_durable = brain_dir / rel_path

    print(f"\n--- Staging Sync for: {rel_path} ---")
    g1_errors, g2_errors = run_dual_verification(staged_file, target_durable, repo_root)

    if g1_errors or g2_errors:
        print(f"❌ VERIFICATION FAILED. Moving {staged_file.name} to quarantine.")
        if g1_errors:
            print("  Gate 1 (Deterministic) Failures:")
            for e in g1_errors:
                print(f"    • {e}")
        if g2_errors:
            print("  Gate 2 (Semantic) Failures:")
            for e in g2_errors:
                print(f"    • {e}")

        # Quarantine
        quarantined_dest = quarantine_dir / f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{staged_file.name}"
        shutil.move(str(staged_file), str(quarantined_dest))
        print(f"  Quarantined to: {quarantined_dest}")
        return False

    print("✅ Gate 1 (Deterministic): PASS")
    print("✅ Gate 2 (Semantic): PASS")

    # Three-way / diff extraction
    delta_notes, traps_defeated, traps_missed = generate_diff_summary(target_durable, staged_file)

    # Atomic commit
    target_durable.parent.mkdir(parents=True, exist_ok=True)
    temp_target = target_durable.with_suffix(".tmp")
    shutil.copy2(str(staged_file), str(temp_target))
    temp_target.replace(target_durable)
    print(f"🚀 Promoted staged update to active wiki: {target_durable.relative_to(repo_root)}")

    # Audit Trail update in changelog.md
    changelog_path = brain_dir / "changelog.md"
    append_to_changelog(
        changelog_path,
        trigger=trigger,
        file_rel=str(rel_path),
        delta_notes=delta_notes,
        traps_defeated=traps_defeated,
        traps_missed=traps_missed,
        next_action=next_action
    )
    print(f"📝 Appended audit record to changelog.md")

    # Clean up staged file
    staged_file.unlink()
    return True

def main():
    parser = argparse.ArgumentParser(description="Staging & Sync Engine for SAT Brain Wiki")
    parser.add_argument("--staging-dir", default=".brain_staging", help="Path to staging directory")
    parser.add_argument("--repo-root", default=".", help="Root of SAT repository")
    parser.add_argument("--trigger", default="manual_sync", help="Trigger event identifier")
    parser.add_argument("--next-action", default="Execute scheduled micro-drill on unmastered traps.", help="Pedagogical next action")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    staging_dir = repo_root / args.staging_dir
    if not staging_dir.exists():
        print(f"Staging directory {staging_dir} does not exist. Nothing to sync.")
        sys.exit(0)

    staged_files = list(staging_dir.glob("**/*.md"))
    if not staged_files:
        print(f"No staged markdown files found in {staging_dir}.")
        sys.exit(0)

    all_passed = True
    for sf in staged_files:
        success = sync_file(sf, repo_root, trigger=args.trigger, next_action=args.next_action)
        if not success:
            all_passed = False

    if all_passed:
        print("\n🎉 All staged files successfully verified and synchronized into SAT Brain Wiki!")
        sys.exit(0)
    else:
        print("\n⚠️ Some staged files failed verification and were quarantined.")
        sys.exit(1)

if __name__ == "__main__":
    main()
