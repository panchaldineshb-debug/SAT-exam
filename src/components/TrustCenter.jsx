import React from 'react';

function TrustCenter({ onNavigate, onBack }) {
  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="trust-page-container fade-in" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 4rem',
      color: '#f4f4f5',
      lineHeight: '1.6'
    }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={onBack} 
          className="back-to-dash-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()}
          className="nav-btn"
          style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          <span>🖨️</span> Print / Save as PDF
        </button>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '16px',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          <span>🛡️</span> Integrity, Transparency & Safety
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', color: '#ffffff', margin: '0 0 1rem 0' }}>
          Trust & Student Support Center
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#d4d4d8', margin: '0 0 1rem 0', maxWidth: '800px' }}>
          We believe high school students, parents, and educators deserve complete transparency regarding what our study tools do, how AI is governed, and how student data is protected.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span><strong>Document Version:</strong> 2.0</span>
          <span><strong>Last Updated:</strong> October 2026</span>
          <span><strong>Status:</strong> Active Implemented Practice</span>
        </div>
      </div>

      {/* Critical Core Boundaries (Plain-Language Box) */}
      <div style={{
        backgroundColor: '#18181b',
        borderLeft: '5px solid #6366f1',
        borderRadius: '10px',
        padding: '1.5rem 1.75rem',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️</span> Core Educational & Safety Boundaries
        </h2>
        <p style={{ margin: '0 0 1rem 0', color: '#e4e4e7', fontSize: '1.05rem', fontWeight: 500 }}>
          “This app is designed to help students practice for the SAT. It is an educational tool, not a mental-health service, medical provider, therapist, or emergency service.”
        </p>
        <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6' }}>
          “AI-generated tutoring can make mistakes. For practice-test questions, the app is engineered to identify when an explanation or answer is verified against the canonical answer key. Students should always double-check intermediate math steps on scratch paper and review official College Board guidelines before exam day.”
        </p>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Truth-in-Advertising & Claims Policy (What We Strictly Avoid):</strong>
          <ul style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: '0.6rem 0 0 1.25rem', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.4rem' }}>
            <li><span style={{ color: '#f87171' }}>✕</span> No "Guaranteed score increase"</li>
            <li><span style={{ color: '#f87171' }}>✕</span> No claims of "Perfect answers"</li>
            <li><span style={{ color: '#f87171' }}>✕</span> Never claim to "Replace your tutor"</li>
            <li><span style={{ color: '#f87171' }}>✕</span> Never claim it "Works for every student"</li>
            <li><span style={{ color: '#f87171' }}>✕</span> Never "Diagnoses learning problems"</li>
            <li><span style={{ color: '#f87171' }}>✕</span> No "College admission guaranteed"</li>
          </ul>
        </div>
      </div>

      {/* Trust Pillars Grid */}
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', marginBottom: '1.5rem', color: '#fff' }}>
        Core Pillars of Our Commitment
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Card 1: What App Does & Does Not Do */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>1. Scope & Boundaries</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              <strong>What we do:</strong> Provide timed practice tests, question skill breakdowns, anti-guessing coaching, and scratch-paper reinforcement.<br /><br />
              <strong>What we do NOT claim or do:</strong> Guarantee score increases, promise college admissions, claim perfect answers, replace tutors or classroom teachers, claim universal efficacy for every student, diagnose learning problems or disabilities, or act as medical/mental healthcare.
            </p>
          </div>
          <a href="/terms" onClick={(e) => handleNav(e, 'terms', '/terms')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Read Terms of Use →
          </a>
        </div>

        {/* Card 2: AI Tutor Grounding */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🧠</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>2. AI Tutor Architecture</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              AI models are never the source of truth for SAT answers. Explanations are strictly grounded in an authoritative 600+ item canonical question repository. If an item cannot be verified, the tutor explicitly declares itself unverified.
            </p>
          </div>
          <a href="/features" onClick={(e) => handleNav(e, 'features', '/features')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Explore Tutor Architecture →
          </a>
        </div>

        {/* Card 3: Student Wellbeing & Crisis Support */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>💚</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>3. Wellbeing & Crisis Support</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Test anxiety is real. We encourage 5-minute micro-study routines and mandatory review buffers to prevent burnout. We provide direct access to 24/7 confidential crisis lifelines.
            </p>
          </div>
          <a href="/student-support" onClick={(e) => handleNav(e, 'student-support', '/student-support')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Student Support & Lifelines →
          </a>
        </div>

        {/* Card 4: Student Data Privacy */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🔐</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>4. Data Collection & Privacy</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Zero advertising trackers. We collect only what is necessary to authenticate and display progress (email, birth month/year, test scores). We never sell student data to data brokers.
            </p>
          </div>
          <a href="/privacy" onClick={(e) => handleNav(e, 'privacy', '/privacy')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Review Privacy Notice →
          </a>
        </div>

        {/* Card 5: Parent / Guardian Controls */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>👨‍👩‍👧</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>5. Parent & Guardian Rights</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Parents can review practice history, generate printable parent-ready diagnostic reports in minutes, and request permanent account/data deletion.
            </p>
          </div>
          <a href="/parent-guide" onClick={(e) => handleNav(e, 'parent-guide', '/parent-guide')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Read Parent Guide →
          </a>
        </div>

        {/* Card 6: Data Rights & Account Deletion */}
        <div className="trust-card" style={{
          backgroundColor: '#131316',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>📋</div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>6. Data Rights & Requests</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Students and parents can exercise self-service account deletion directly from the dashboard, request exports of test history, or submit privacy inquiries.
            </p>
          </div>
          <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Exercise Data Rights →
          </a>
        </div>
      </div>

      {/* Safety Notice & Legal Status Disclaimer */}
      <div style={{
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem'
      }}>
        <h3 style={{ color: '#f4f4f5', fontSize: '1.15rem', marginTop: 0, marginBottom: '0.75rem' }}>
          Qualified Legal & Regulatory Review Notice
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
          <strong>Accurate Status of Implemented Controls:</strong> We enforce an under-13 registration block via dual-layer client and server age checks, manage passwords through AWS Cognito, and reject all third-party tracking cookies. However, this application has not obtained third-party certifications such as an FTC-approved COPPA Safe Harbor seal or formal institutional FERPA audit. Formal compliance certifications remain <strong>[Pending Qualified Legal & Regulatory Review]</strong>. We describe our actual technical practices without exaggerated legal claims.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} className="nav-btn primary" style={{ textDecoration: 'none' }}>
            Contact & Safety Reporting
          </a>
          <a href="/privacy" onClick={(e) => handleNav(e, 'privacy', '/privacy')} className="nav-btn" style={{ background: '#27272a', color: '#fff', textDecoration: 'none' }}>
            View Full Privacy Notice
          </a>
        </div>
      </div>
    </div>
  );
}

export default TrustCenter;
