import React from 'react';

function ParentGuide({ onNavigate, onBack }) {
  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="parent-guide-container fade-in" style={{
      maxWidth: '950px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 4rem',
      color: '#f4f4f5',
      lineHeight: '1.6'
    }}>
      {/* Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={onBack} className="back-to-dash-btn">
          ← Back
        </button>
        <button 
          onClick={() => window.print()}
          className="nav-btn"
          style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          <span>🖨️</span> Print / Save as PDF
        </button>
      </div>

      {/* Main Title & Metadata */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <span>👨‍👩‍👦</span> Family & Guardian Information
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.3rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Parent & Guardian Guide
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
          Version 2.0 • Last Updated: October 2026 • Audience: Parents, Legal Guardians, and Caregivers
        </p>
      </div>

      {/* Hero Summary Card */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: 0, marginBottom: '0.75rem', fontFamily: 'var(--font-title)' }}>
          Our Approach to Supporting Your Student
        </h2>
        <p style={{ color: '#d4d4d8', fontSize: '1rem', marginBottom: '1.25rem' }}>
          As a parent or guardian, you want to know how your high school student is spending their study time and whether their personal data is protected. 
          We designed SAT Prep Suite to keep parents and tutors informed while protecting student privacy:
        </p>
        <blockquote style={{
          margin: '0 0 1.25rem 0',
          padding: '1rem 1.25rem',
          borderLeft: '4px solid #38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          borderRadius: '0 8px 8px 0',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '1.1rem',
          lineHeight: '1.5'
        }}>
          “A system that shows which skill each student is missing, gives controlled assistance, assigns the next best practice, and generates a parent-ready progress report in minutes.”
        </blockquote>
      </div>

      {/* 4 Key Pillars for Parents */}
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: '#fff', marginBottom: '1.25rem' }}>
        What Parents Need to Know
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Pillar 1: Parent-Ready Reports */}
        <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>1. Instant Parent-Ready Reports</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            After every completed practice test, students can click <strong>“Generate Parent-Ready Report”</strong> in Review Mode. It creates a concise, printable diagnostic summary outlining exact missed skills, Socratic tutor feedback, and the assigned next best practice so you never have to guess how prep is going.
          </p>
        </div>

        {/* Pillar 2: Controlled Assistance (No Answer Spoon-Feeding) */}
        <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>2. Anti-Guessing & Socratic Tutoring</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            Unlike generic AI chatbots that simply give away answers, our AI tutor is bound by strict pedagogical guardrails. It never gives the direct answer. Instead, it provides step-by-step Socratic hints that teach students to write out math on scratch paper and avoid common trap answers.
          </p>
        </div>

        {/* Pillar 3: Student Privacy Protection */}
        <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>3. Minimal Data Collection</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            We collect only the bare minimum needed for education: student email, birth month/year (to verify age eligibility), and practice test scores. We do not collect credit cards, home addresses, phone numbers, or social media accounts. We do not sell data to marketers.
          </p>
        </div>

        {/* Pillar 4: Age Verification */}
        <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎂</div>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>4. Age Eligibility (13+)</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            This application is tailored for high school students. In accordance with child privacy practices, students under age 13 are prohibited from registering, enforced by both frontend and cloud API age checks. Students under 18 should use the platform with parent or guardian oversight.
          </p>
        </div>
      </div>

      {/* Parent Rights & Controls Accordion / Section */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: '#fff', marginTop: 0, marginBottom: '1rem' }}>
          Parental Rights & Account Controls
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ color: '#38bdf8', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
              • Right to Review Student Data
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              You may sit with your student to inspect their dashboard, review every question they have practiced, and read AI tutor advice logs at any time.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#38bdf8', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
              • Right to Delete Student Account & History
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              Students or parents can permanently delete the account at any time using the self-service <strong>“Delete Account”</strong> button located in the student dashboard, or by submitting a written request to our privacy desk. Deletion removes the user from AWS Cognito.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#38bdf8', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
              • Right to Inquire or Restrict AI Tutor Access
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              If you have concerns about automated Socratic feedback or wish to request data correction, contact us directly at <a href="mailto:panchaldineshb@gmail.com" style={{ color: '#818cf8' }}>panchaldineshb@gmail.com</a>. We respond to verified parent inquiries within 30 calendar days.
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Legal Status Callout */}
      <div style={{
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <h3 style={{ color: '#fbbf24', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.5rem' }}>
          Notice Regarding Institutional FERPA & COPPA Certifications
        </h3>
        <p style={{ color: '#d4d4d8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
          <strong>Transparency Note:</strong> While our technical architecture enforces age verification, encryption, and zero advertising trackers, this independent website is an educational practice tool and has not undergone third-party auditing for an FTC-approved COPPA Safe Harbor seal or formal institutional FERPA designation. Formal institutional certifications are <strong>[Pending Qualified Legal Review]</strong>. We encourage parents and tutors to review these guidelines collaboratively.
        </p>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} className="nav-btn primary" style={{ textDecoration: 'none' }}>
          Data Rights & Requests
        </a>
        <a href="/trust" onClick={(e) => handleNav(e, 'trust', '/trust')} className="nav-btn" style={{ background: '#27272a', color: '#fff', textDecoration: 'none' }}>
          Trust Center Landing Page
        </a>
        <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} className="nav-btn" style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', textDecoration: 'none' }}>
          Contact Administration
        </a>
      </div>
    </div>
  );
}

export default ParentGuide;
