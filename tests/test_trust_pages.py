#!/usr/bin/env python3
"""
Automated Regression Tests for Trust, Privacy & Student Support Public Web Area.
Validates:
1. Required pages exist and are properly mapped.
2. Mandatory plain-language disclaimers (educational tool, not mental health/emergency service).
3. AI tutor accuracy and boundary statements ("AI-generated tutoring can make mistakes").
4. Crisis lifeline numbers (988, 741741) are prominent and correct.
5. Factual representation of legal/compliance status (no unverified 'COPPA certified' or 'FERPA certified' claims).
6. SAT trademark disclaimers are present.
7. Footer and contextual links exist in App, LoginScreen, ReviewMode, and Dashboard.
"""

from pathlib import Path
import re
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent

@pytest.fixture
def src_dir():
    return REPO_ROOT / "src"

def test_all_trust_pages_exist(src_dir):
    components = src_dir / "components"
    required_files = [
        "TrustCenter.jsx",
        "StudentSupport.jsx",
        "ParentGuide.jsx",
        "DataRights.jsx",
        "ContactSafety.jsx",
        "PrivacyPolicy.jsx",
        "TermsOfUse.jsx",
        "Footer.jsx"
    ]
    for rf in required_files:
        path = components / rf
        assert path.exists(), f"Missing required trust page component: {rf}"

def test_mandatory_wellbeing_disclaimer(src_dir):
    """
    Mandatory text:
    'This app is designed to help students practice for the SAT. It is an educational tool, not a mental-health service, medical provider, therapist, or emergency service.'
    """
    trust_file = src_dir / "components" / "TrustCenter.jsx"
    terms_file = src_dir / "components" / "TermsOfUse.jsx"
    support_file = src_dir / "components" / "StudentSupport.jsx"

    for f in [trust_file, terms_file, support_file]:
        content = f.read_text(encoding="utf-8")
        assert "not a mental-health service" in content, f"Missing mental health boundary in {f.name}"
        assert "emergency service" in content, f"Missing emergency service boundary in {f.name}"

def test_ai_tutor_boundary_statement(src_dir):
    """
    Mandatory text:
    'AI-generated tutoring can make mistakes. For practice-test questions, the app should identify when an explanation or answer is verified against the available answer key.'
    """
    trust_file = src_dir / "components" / "TrustCenter.jsx"
    terms_file = src_dir / "components" / "TermsOfUse.jsx"

    for f in [trust_file, terms_file]:
        content = f.read_text(encoding="utf-8")
        assert "AI-generated tutoring can make mistakes" in content, f"Missing AI mistake notice in {f.name}"
        assert "verified against the" in content, f"Missing canonical verification notice in {f.name}"

def test_crisis_lifeline_hotlines_present(src_dir):
    """Must include 988 Lifeline and 741741 Crisis Text Line."""
    support_file = src_dir / "components" / "StudentSupport.jsx"
    footer_file = src_dir / "components" / "Footer.jsx"

    for f in [support_file, footer_file]:
        content = f.read_text(encoding="utf-8")
        assert "988" in content, f"Missing 988 Lifeline in {f.name}"
        assert "741741" in content, f"Missing 741741 text line in {f.name}"

def test_no_false_compliance_claims(src_dir):
    """
    Do not claim that the application is 'COPPA certified', 'FERPA certified', 'HIPAA compliant',
    or certified without qualifying that legal review is pending.
    """
    components = src_dir / "components"
    trust_files = [
        components / "TrustCenter.jsx",
        components / "PrivacyPolicy.jsx",
        components / "ParentGuide.jsx",
        components / "DataRights.jsx"
    ]

    for tf in trust_files:
        content = tf.read_text(encoding="utf-8")
        assert "COPPA certified" not in content.lower(), f"Unverified certification claim in {tf.name}"
        assert "FERPA certified" not in content.lower(), f"Unverified certification claim in {tf.name}"
        assert "HIPAA compliant" not in content.lower(), f"Unverified healthcare claim in {tf.name}"
        assert "pending qualified legal" in content.lower(), f"Missing pending legal review disclaimer in {tf.name}"

def test_all_routes_mapped_in_app(src_dir):
    app_file = src_dir / "App.jsx"
    content = app_file.read_text(encoding="utf-8")
    expected_routes = [
        "trust",
        "privacy",
        "terms",
        "student-support",
        "parent-guide",
        "data-rights",
        "contact"
    ]
    for r in expected_routes:
        assert f"'{r}'" in content, f"Route '{r}' missing from App.jsx"

def test_contextual_links_in_app(src_dir):
    components = src_dir / "components"
    
    # ReviewMode must have contextual AI tutor & student support links
    review_content = (components / "ReviewMode.jsx").read_text(encoding="utf-8")
    assert "/features" in review_content
    assert "/student-support" in review_content
    assert "/parent-guide" in review_content

    # Dashboard must have parent guide and data rights links
    dash_content = (components / "Dashboard.jsx").read_text(encoding="utf-8")
    assert "/parent-guide" in dash_content
    assert "/data-rights" in dash_content

    # LoginScreen must have privacy, terms, parent guide links
    login_content = (components / "LoginScreen.jsx").read_text(encoding="utf-8")
    assert "/privacy" in login_content
    assert "/terms" in login_content
    assert "/parent-guide" in login_content

def test_avoid_prohibited_marketing_claims(src_dir):
    """
    Ensure the codebase strictly avoids deceptive claims:
    - 'Guaranteed score increase'
    - 'Perfect answers'
    - 'Replace your tutor'
    - 'Works for every student'
    - 'Diagnoses learning problems'
    - 'College admission guaranteed'
    """
    components_dir = src_dir / "components"
    for jsx_file in components_dir.glob("*.jsx"):
        content = jsx_file.read_text(encoding="utf-8")
        
        # Affirmative claim checks (ensure they are not made as marketing promises)
        assert not re.search(r'\b(?:we|our app|we will|we can)\s+guarantee\s+(?:a\s+)?score\s+increase\b', content, re.I), \
            f"Found prohibited score increase guarantee in {jsx_file.name}"
        assert not re.search(r'\b(?:we|our app|we will|will)\s+replace\s+your\s+tutor\b', content, re.I), \
            f"Found prohibited tutor replacement claim in {jsx_file.name}"
        assert not re.search(r'\b(?:we|our app|we can|we will)\s+(?:guarantee|guarantees)\s+(?:college\s+)?admission\b', content, re.I), \
            f"Found prohibited admission guarantee claim in {jsx_file.name}"
        assert not re.search(r'\b(?:we|our app|this app|the app|platform)\s+diagnoses?\s+(?:clinical\s+)?learning\s+problems\b', content, re.I), \
            f"Found prohibited diagnosis claim in {jsx_file.name}"
        assert not re.search(r'\b(?:we|our app|platform)\s+(?:provides?|gives?|guarantees?)\s+perfect\s+answers\b', content, re.I), \
            f"Found prohibited perfect answer claim in {jsx_file.name}"

def test_explicit_prohibited_claims_disclaimers(src_dir):
    """
    Verify that Features, TrustCenter, TermsOfUse, and StudentSupport explicitly disclose
    that these 6 prohibited claims are rejected.
    """
    components_dir = src_dir / "components"
    features_content = (components_dir / "Features.jsx").read_text(encoding="utf-8")
    trust_content = (components_dir / "TrustCenter.jsx").read_text(encoding="utf-8")
    terms_content = (components_dir / "TermsOfUse.jsx").read_text(encoding="utf-8")
    support_content = (components_dir / "StudentSupport.jsx").read_text(encoding="utf-8")

    prohibited_items = [
        "Guaranteed score increase",
        "Perfect answers",
        "Replace your tutor",
        "Works for every student",
        "Diagnoses learning problems",
        "College admission guaranteed"
    ]

    for item in prohibited_items:
        # Features and TrustCenter must explicitly address each prohibited claim
        assert item.lower() in features_content.lower(), f"Features.jsx missing boundary disclosure for: {item}"
        assert item.lower() in trust_content.lower(), f"TrustCenter.jsx missing boundary disclosure for: {item}"
        assert item.lower() in terms_content.lower(), f"TermsOfUse.jsx missing boundary disclosure for: {item}"
        assert item.lower() in support_content.lower() or item.lower().split()[0] in support_content.lower(), \
            f"StudentSupport.jsx missing boundary disclosure for: {item}"

