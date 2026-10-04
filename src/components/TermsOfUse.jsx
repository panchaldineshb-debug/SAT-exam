import React from 'react';

function TermsOfUse({ onNavigate, onBack }) {
  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="practice-container fade-in" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: '900px', margin: '0 auto', color: '#f4f4f5', lineHeight: '1.6' }}>
      {/* Navigation & Print Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={onBack} 
          className="back-to-dash-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>← Back</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="nav-btn"
          style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          <span>🖨️</span> Print / Save as PDF
        </button>
      </div>

      {/* Header */}
      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', marginBottom: '0.5rem', color: '#fff' }}>
        Terms of Use
      </h1>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>
        <span><strong>Version:</strong> 2.0</span>
        <span><strong>Last Updated:</strong> October 2026</span>
        <span><strong>Scope:</strong> Binding Agreement for SAT Prep Suite</span>
      </div>

      {/* Critical Core Boundaries Box */}
      <div style={{ backgroundColor: '#18181b', borderLeft: '4px solid #f59e0b', padding: '1.25rem 1.5rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
          Educational Tool & Non-Emergency Notice
        </h3>
        <p style={{ color: '#d4d4d8', fontSize: '0.95rem', margin: '0 0 0.75rem 0' }}>
          “This app is designed to help students practice for the SAT. It is an educational tool, not a mental-health service, medical provider, therapist, or emergency service.”
        </p>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
          If you or someone you know is in crisis, call or text <strong>988</strong> (US Suicide & Crisis Lifeline) or visit our <a href="/student-support" onClick={(e) => handleNav(e, 'student-support', '/student-support')} style={{ color: '#818cf8' }}>Student Support & Crisis Info Page</a>.
        </p>
      </div>

      <div style={{ color: '#d4d4d8' }}>
        {/* Section 1 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          1. Acceptance & Age Eligibility
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          By creating an account, accessing, or using the SAT Prep Suite application, you confirm that:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>You are at least 13 years of age. Users under age 13 are strictly prohibited from creating accounts or submitting personal data.</li>
          <li>If you are between the ages of 13 and 18, you have obtained the permission of a parent or legal guardian to use this educational service.</li>
          <li>You agree to comply with these Terms of Use and our <a href="/privacy" onClick={(e) => handleNav(e, 'privacy', '/privacy')} style={{ color: '#818cf8' }}>Privacy Notice</a>.</li>
        </ul>

        {/* Section 2 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          2. Educational Practice & AI Tutor Boundaries
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Our platform offers practice questions, timed simulations, and AI-assisted tutoring. You acknowledge and agree to the following operational boundaries:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li>
            <strong>AI Output Limitations & No Claim of Perfect Answers:</strong> “AI-generated tutoring can make mistakes. For practice-test questions, the app should identify when an explanation or answer is verified against the available answer key. Students should always double-check intermediate math steps on scratch paper and never treat unverified AI outputs as absolute truth.” We strictly disclaim any claims of perfect answers or infallible artificial intelligence.
          </li>
          <li>
            <strong>Socratic Method:</strong> The AI tutor is engineered to provide hints, guided questions, and step-by-step logic. It does not hand out direct answers to active practice problems.
          </li>
          <li>
            <strong>No Guaranteed Score Increases or College Admissions:</strong> Practice scores and percentile approximations generated in this app are estimates designed to guide study habits. We make no claim of a “guaranteed score increase” and make no “college admission guaranteed” promise.
          </li>
          <li>
            <strong>Non-Replacement of Tutors and Educators:</strong> The platform is designed solely as an instructional tool to empower tutors, teachers, and independent learners. We never claim to “replace your tutor”, classroom teacher, or school counselor.
          </li>
          <li>
            <strong>No Universal Efficacy Claims:</strong> Every student has unique baseline skills and study schedules. We explicitly avoid claiming that this platform “works for every student.”
          </li>
          <li>
            <strong>Academic Question Skill Analysis Only:</strong> Diagnostic breakdowns identify academic test question topics (e.g. system of equations, punctuation). The platform never “diagnoses learning problems”, clinical cognitive disorders, or disabilities.
          </li>
        </ul>

        {/* Section 3 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          3. User Responsibilities & Acceptable Use
        </h2>
        <p style={{ marginBottom: '1rem' }}>You agree not to:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>Attempt to bypass, manipulate, or falsify birth month or birth year during the age-gate check.</li>
          <li>Scrape, extract, copy, or redistribute practice questions, vetted explanations, or backend APIs.</li>
          <li>Input abusive, profane, harassing, or sexually explicit content into the tutor interface.</li>
          <li>Attempt to overload, decompile, or compromise the AWS infrastructure or local router endpoints.</li>
        </ul>

        {/* Section 4 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          4. Intellectual Property & Trademark Notice
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          <strong>SAT® Trademark:</strong> SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, sponsor, or administer this independent study application. All references to the SAT are strictly for fair-use nominative and educational purposes.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          All original application software, user interface designs, and instructional layouts are protected by applicable copyright and intellectual property laws.
        </p>

        {/* Section 5 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          5. Termination & Account Deletion
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          You may terminate your agreement with us at any time by deleting your account via the <em>“Delete Account”</em> button on your student dashboard or by submitting a request via our <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} style={{ color: '#818cf8' }}>Data Rights Page</a>. We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>

        {/* Section 6 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          6. Disclaimer of Warranties & Limitation of Liability
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          This service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. In no event shall the platform operators be liable for any indirect, incidental, punitive, or consequential damages resulting from your use or inability to use this service.
        </p>

        {/* Section 7 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          7. Contact Information
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          If you have questions regarding these Terms, contact us at <a href="mailto:panchaldineshb@gmail.com" style={{ color: '#818cf8' }}>panchaldineshb@gmail.com</a> or visit our <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} style={{ color: '#818cf8' }}>Contact & Safety Page</a>.
        </p>
      </div>
    </div>
  );
}

export default TermsOfUse;
