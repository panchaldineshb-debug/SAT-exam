#!/usr/bin/env python3
"""
Automated Regression Tests for Verified AI Tutor Grounding.
Ensures:
1. Canonical answer key in stored repository is the sole authority.
2. Model cannot invent, override, or replace canonical answers.
3. Unverified questions are explicitly flagged with answerVerified=False.
4. Generic algebra fallbacks are never returned for verbal or unrelated questions.
5. Hints are Socratic and grounded in vetted explanations.
6. HTTP endpoints strictly adhere to required JSON response schema.
"""

import sys
import json
from pathlib import Path
from unittest.mock import patch, MagicMock

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import pytest
from scripts.question_normalizer import QuestionNormalizer
from scripts.inference_router import InferenceRouter

@pytest.fixture
def normalizer():
    return QuestionNormalizer(repo_root=REPO_ROOT)

@pytest.fixture
def router(normalizer):
    return InferenceRouter(normalizer=normalizer)

# ==============================================================================
# 1. QUESTION NORMALIZER & CANONICAL BANK TESTS
# ==============================================================================

def test_question_normalizer_indexes_master_tests(normalizer):
    count = normalizer.list_indexed_count()
    assert count >= 600, f"Expected at least 600 canonical questions, found {count}"

    # Test verbal item lookup
    v_rec = normalizer.get_question("verbal-1:1")
    assert v_rec is not None, "Failed to retrieve verbal-1:1"
    assert v_rec["canonicalAnswer"] == "B"
    assert v_rec["subject"] == "verbal"
    assert "speculates" in v_rec["options"][1]
    assert len(v_rec["explanation"]) > 20

    # Test math item lookup
    m_rec = normalizer.get_question("math-1:1")
    assert m_rec is not None, "Failed to retrieve math-1:1"
    assert m_rec["subject"] == "math"
    assert m_rec["canonicalAnswer"] == "B"

    # Test compound & global ID aliases
    alias_rec = normalizer.get_question("verbal-1:q1")
    assert alias_rec is not None
    assert alias_rec["canonicalAnswer"] == "B"

    gid_rec = normalizer.get_question("global:1")
    assert gid_rec is not None
    assert gid_rec["canonicalAnswer"] == "B"

def test_question_normalizer_returns_none_for_invalid():
    normalizer = QuestionNormalizer(repo_root=REPO_ROOT)
    assert normalizer.get_question("nonexistent-test:999") is None
    assert normalizer.get_question("") is None
    assert normalizer.get_question(None) is None

# ==============================================================================
# 2. VERIFIED TUTOR AUTHORITY & SCHEMA COMPLIANCE
# ==============================================================================

def test_verified_tutor_authoritative_canonical_answer(router):
    """Grounds response in canonical answer key and returns strict schema."""
    res = router.tutor_verify(
        question_id="verbal-1:1",
        selected_answer="A",
        mode="hint",
        student_query="Why is Ochoa conjecturing?"
    )

    # Schema assertions
    assert res["questionId"] == "verbal-1:1"
    assert res["canonicalAnswer"] == "B"
    assert res["selectedAnswer"] == "A"
    assert res["answerVerified"] is True
    assert res["mode"] == "hint"
    assert res["source"] == "canonical_question_bank"
    assert "promptVersion" in res
    assert len(res["hint"]) > 10

def test_model_cannot_override_canonical_answer(router):
    """
    Simulates a rogue or hallucinating model proposing an incorrect answer ('D').
    Verifies that the canonical answer ('B') remains inviolable.
    """
    hallucinated_model_response = {
        "id": "chat-mock-hallucinate",
        "provider": "mock_ollama",
        "model": "llama3.2:3b",
        "message": {
            "role": "assistant",
            "content": json.dumps({
                "hint": "Check choice D carefully.",
                "explanation": "I believe D is the correct answer because it establishes the fact.",
                "assistantAnswer": "D" # Conflicting with canonical "B"
            })
        }
    }

    with patch.object(router, "check_ollama_alive", return_value=True), \
         patch.object(router, "chat", return_value=hallucinated_model_response):
        
        res = router.tutor_verify(
            question_id="verbal-1:1",
            selected_answer="C",
            mode="explanation"
        )

        # The canonical answer must remain B, NEVER D
        assert res["canonicalAnswer"] == "B", "Model overrode the canonical answer!"
        assert res["answerVerified"] is True

# ==============================================================================
# 3. UNVERIFIED QUESTIONS & HONEST FALLBACKS
# ==============================================================================

def test_unmatched_question_returns_unverified_status(router):
    """Unrecognized question IDs must explicitly return answerVerified=False."""
    bad_id = "bogus-test:404"
    res = router.tutor_verify(question_id=bad_id, selected_answer="A")

    assert res["questionId"] == bad_id
    assert res["answerVerified"] is False
    assert res["canonicalAnswer"] is None
    assert res["source"] == "unverified"
    assert "cannot verify" in res["hint"].lower()
    assert "not found" in res["explanation"].lower()

def test_missing_question_id_returns_unverified_status(router):
    """Empty or None question ID returns unverified status."""
    res = router.tutor_verify(question_id="", selected_answer=None)
    assert res["answerVerified"] is False
    assert res["canonicalAnswer"] is None
    assert "required" in res["hint"].lower()

def test_no_misleading_generic_algebra_fallback_on_verbal(router):
    """
    Verbal questions must NEVER receive generic algebra hints
    like 'Work this out algebraically on scratch paper'.
    """
    res = router.tutor_verify(question_id="verbal-1:1", mode="hint")
    assert "algebraically" not in res["hint"].lower()
    assert "substitute the known values" not in res["hint"].lower()
    assert "contextual clue" in res["hint"].lower() or "passage" in res["hint"].lower()

def test_offline_chat_does_not_pretend_to_solve_unrelated_question(router):
    """Ungrounded chat when Ollama is offline must not output generic algebra solver text."""
    with patch.object(router, "check_ollama_alive", return_value=False):
        res = router.chat(messages=[{"role": "user", "content": "What is the capital of France?"}])
        content = res["message"]["content"]
        assert "algebraically" not in content.lower()
        assert "unreachable" in content.lower() or "offline" in content.lower()

# ==============================================================================
# 4. SOCRATIC HINT MODE & EXPLANATION MODE
# ==============================================================================

def test_socratic_hint_mode_does_not_leak_direct_answer(router):
    """
    In 'hint' mode, the hint must not directly say 'The answer is B'.
    It should guide the student with clues and trap checks.
    """
    res = router.tutor_verify(question_id="math-1:1", selected_answer="C", mode="hint")
    assert res["mode"] == "hint"
    assert "the answer is b" not in res["hint"].lower()
    assert "correct answer is b" not in res["hint"].lower()
    assert len(res["hint"]) > 20

def test_explanation_mode_returns_vetted_explanation(router):
    """In 'explanation' mode, the vetted explanation from the master record is delivered."""
    res = router.tutor_verify(question_id="verbal-1:1", mode="explanation")
    assert res["mode"] == "explanation"
    assert "Choice B is the best answer" in res["explanation"]
    assert "Choice A is incorrect" in res["explanation"]

def test_chat_with_question_id_auto_grounds(router):
    """Sending chat messages with a questionId automatically uses canonical grounding."""
    res = router.chat(
        messages=[{"role": "user", "content": "I am stuck on this question"}],
        question_id="verbal-1:1"
    )
    assert res["provider"] == "canonical_tutor_router"
    assert "verified_record" in res
    assert res["verified_record"]["canonicalAnswer"] == "B"
    assert res["verified_record"]["answerVerified"] is True

# ==============================================================================
# 5. HTTP ENDPOINT TESTS
# ==============================================================================

def test_http_tutor_verify_endpoint():
    """Validates HTTP server handling for /tutor/verify endpoint."""
    import threading
    from http.server import HTTPServer
    from urllib import request as url_req
    from scripts.inference_router import RouterHTTPHandler

    # Use ephemeral port 0
    server = HTTPServer(("127.0.0.1", 0), RouterHTTPHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        url = f"http://127.0.0.1:{port}/tutor/verify"
        payload = json.dumps({
            "questionId": "verbal-1:1",
            "selectedAnswer": "A",
            "mode": "hint"
        }).encode("utf-8")

        req = url_req.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with url_req.urlopen(req, timeout=3.0) as resp:
            assert resp.status == 200
            data = json.loads(resp.read().decode("utf-8"))
            assert data["questionId"] == "verbal-1:1"
            assert data["canonicalAnswer"] == "B"
            assert data["answerVerified"] is True
            assert data["source"] == "canonical_question_bank"
    finally:
        server.shutdown()
        server.server_close()

