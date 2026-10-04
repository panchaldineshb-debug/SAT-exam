import React from 'react';

function StudentSupport({ onNavigate, onBack }) {
  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="support-page-container fade-in" style={{
      maxWidth: '950px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 4rem',
      color: '#f4f4f5',
      lineHeight: '1.6'
    }}>
      {/* Navigation Header */}
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
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.3rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Student Support & Wellbeing
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
          Version 2.0 • Last Updated: October 2026 • Policy Owner: Student Safety & Academic Guidance
        </p>
      </div>

      {/* URGENT CRISIS SUPPORT BANNER */}
      <div style={{
        backgroundColor: '#1f1315',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem',
        boxShadow: '0 6px 24px rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🚨</span>
          <h2 style={{ fontSize: '1.4rem', color: '#fca5a5', margin: 0, fontFamily: 'var(--font-title)' }}>
            Immediate Crisis & Mental Health Resources
          </h2>
        </div>
        <p style={{ color: '#fecaca', fontSize: '1.05rem', margin: '0 0 1.25rem 0' }}>
          Preparing for college exams is challenging, but your mental health, personal safety, and life always come first. 
          If you are experiencing severe anxiety, depression, thoughts of self-harm, or overwhelming distress, free and confidential support is available 24/7:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Lifeline 1 */}
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              988 Suicide & Crisis Lifeline
            </div>
            <div style={{ color: '#f87171', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Call or Text: 988
            </div>
            <p style={{ color: '#d4d4d8', fontSize: '0.85rem', margin: 0 }}>
              24/7, free, and confidential support across the United States and Canada. Available in English and Spanish.
            </p>
          </div>

          {/* Lifeline 2 */}
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              Crisis Text Line
            </div>
            <div style={{ color: '#f87171', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Text: HOME to 741741
            </div>
            <p style={{ color: '#d4d4d8', fontSize: '0.85rem', margin: 0 }}>
              Free 24/7 text support with trained crisis volunteer counselors for any crisis scenario.
            </p>
          </div>

          {/* Lifeline 3 */}
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              The Trevor Project (LGBTQ Youth)
            </div>
            <div style={{ color: '#f87171', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Call: 1-866-488-7386
            </div>
            <p style={{ color: '#d4d4d8', fontSize: '0.85rem', margin: 0 }}>
              Or text START to 678-678. Dedicated crisis intervention and suicide prevention for LGBTQ young people.
            </p>
          </div>
        </div>

        <p style={{ color: '#fca5a5', fontSize: '0.85rem', margin: 0 }}>
          <strong>Immediate Physical Danger:</strong> If you or someone you know is in immediate life-threatening physical danger, please call <strong>911</strong> or visit the nearest emergency room immediately.
        </p>
      </div>

      {/* Clear Educational Boundaries */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: '#fff', marginTop: 0, marginBottom: '0.75rem' }}>
          What This SAT Study Tool Is and Is Not
        </h2>
        <p style={{ color: '#e4e4e7', fontSize: '1rem', fontWeight: 500, margin: '0 0 1.25rem 0', borderLeft: '3px solid #6366f1', paddingLeft: '0.75rem' }}>
          “This app is designed to help students practice for the SAT. It is an educational tool, not a mental-health service, medical provider, therapist, or emergency service.”
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ color: '#34d399', fontSize: '1rem', marginTop: 0, marginBottom: '0.5rem' }}>
              ✓ What This Application Provides
            </h3>
            <ul style={{ color: '#d4d4d8', fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>Timed practice modules simulating the Digital SAT format</li>
              <li>Socratic hints and step-by-step diagnostic feedback on missed questions</li>
              <li>Categorization across Foundations, Medium, and Advanced math/reading skills</li>
              <li>Encouragement of scratch-paper problem solving and anti-guessing discipline</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ color: '#f87171', fontSize: '1rem', marginTop: 0, marginBottom: '0.5rem' }}>
              ✕ What This Application Does NOT Provide (Claims We Strictly Avoid)
            </h3>
            <ul style={{ color: '#d4d4d8', fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>“Guaranteed score increase” or “College admission guaranteed”</li>
              <li>“Perfect answers” or infallible AI tutoring</li>
              <li>Claims to “Replace your tutor” or classroom teacher</li>
              <li>Claims that it “Works for every student” (learning styles differ)</li>
              <li>Claims that it “Diagnoses learning problems” or clinical cognitive disabilities</li>
              <li>Medical, psychiatric, or mental-health therapy or counseling</li>
              <li>Crisis intervention, wellness monitoring, or emergency response</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategies for Managing Test Anxiety & Study Fatigue */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: '#fff', marginTop: 0, marginBottom: '1rem' }}>
          Evidence-Based Strategies for SAT Fatigue & Anxiety
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          SAT preparation is a marathon, not an overnight sprint. Our platform methodology incorporates specific safeguards to protect your stamina:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '1rem' }}>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem 0' }}>1. The 5-Minute Micro-Study Routine</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              Avoid 4-hour weekend cram sessions. Practicing 2 to 3 targeted example questions daily produces significantly higher retention with virtually zero mental fatigue.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1rem' }}>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem 0' }}>2. The Review Buffer (Anti-Rushing Protocol)</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              Finishing early is never a victory. If you finish a test section with time remaining, do not submit early. Take a 2-second breath, then calmly review the last 5 questions with fresh eyes.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '1rem' }}>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem 0' }}>3. Scratch-Paper First (Anti-Guessing Rule)</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              Never stare at tricky multiple-choice options trying to guess. Write down the algebraic steps or cross out extreme poison words physically on paper to quiet test-induced cognitive overload.
            </p>
          </div>
        </div>
      </div>

      {/* Reporting Safety Concerns */}
      <div style={{
        backgroundColor: '#131316',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>
            Have a question or safety concern?
          </h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            Reach out to our student support team for prompt assistance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} className="nav-btn primary" style={{ textDecoration: 'none' }}>
            Contact & Safety Reporting
          </a>
          <a href="/trust" onClick={(e) => handleNav(e, 'trust', '/trust')} className="nav-btn" style={{ background: '#27272a', color: '#fff', textDecoration: 'none' }}>
            Trust Center
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentSupport;
