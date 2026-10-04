import React from 'react';

const Features = ({ onBack }) => {
  return (
    <div className="single-pane fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <button onClick={onBack} className="back-to-dash-btn">
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--primary-color)' }}>
          Platform Features & Tutor Architecture
        </h1>
      </div>

      {/* Tutor & Educator Hero Pitch */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.12) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '2.25rem',
        marginBottom: '3rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <span>🎯</span> The Educator & Tutor Pitch
        </div>

        <blockquote style={{
          margin: '0 0 1.25rem 0',
          fontFamily: 'var(--font-title)',
          fontSize: '1.45rem',
          lineHeight: '1.45',
          color: '#ffffff',
          fontWeight: 600,
          borderLeft: '4px solid #38bdf8',
          paddingLeft: '1.25rem'
        }}>
          “A system that shows which skill each student is missing, gives controlled assistance, assigns the next best practice, and generates a parent-ready progress report in minutes.”
        </blockquote>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Our pitch to tutors and educators is never generic “AI tutoring.” We deliver a structured diagnostic and instructional workflow that keeps tutors in control while accelerating student progress.
        </p>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(24, 24, 27, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              1. Missing Skill Isolation
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Instantly surfaces which specific test question concept or difficulty tier (Foundations, Medium, Advanced) the student missed. Targets academic question skills (e.g., quadratic factoring, comma splices), not clinical learning problems.
            </p>
          </div>

          <div style={{ background: 'rgba(24, 24, 27, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🛡️</div>
            <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              2. Controlled Assistance
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Never hands out direct answers or promises infallible AI answers. Provides step-by-step Socratic hints grounded in canonical question keys so students work through algebraic steps on scratch paper.
            </p>
          </div>

          <div style={{ background: 'rgba(24, 24, 27, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              3. Next Best Practice
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Dynamically targets and assigns the optimal follow-up drill or question set to resolve the exact error patterns identified.
            </p>
          </div>

          <div style={{ background: 'rgba(24, 24, 27, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              4. Parent-Ready Reports
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Generates clean, professional progress reports with score trends, accuracy benchmarks, and tutor notes in minutes.
            </p>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Core Platform Capabilities
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Feature 1 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Passwordless OTP Login</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Eliminates the burden of remembering complex passwords and completely nullifies the risk of password reuse or credential stuffing attacks. Secure, frictionless access directly via your email.
          </p>
        </div>

        {/* Feature 2: Controlled Assistance */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-emerald-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Controlled Socratic Assistance</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Replaces generic answer handouts with controlled, step-by-step Socratic hints. Grounded in official rules via AWS Bedrock, it assists students through mathematical logic and passage synthesis without spoiling the answer.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-amber-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-amber)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Mistake Journal & Daily Challenges</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            A dedicated journal that records and tags every missed question for review, paired with a daily micro-challenge system to maintain engagement. Builds study consistency through focused 5-minute micro-engagements.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-rose-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-rose)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Exam Popularity & Rating System</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Students and teachers rate tests and review community difficulty ratings. This crowdsourced data helps tutors organically discover the most helpful or appropriately challenging practice materials based on peer feedback.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="stats-card" style={{ borderLeft: '4px solid #818cf8', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(129, 140, 248, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#818cf8' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Interactive Dashboard & Progress Reporting</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Visual charts map your score progression over time, providing transparent, data-driven insights into your strengths and weaknesses. Enables instant generation of parent-ready summaries and tracks mastery toward the 1400+ score milestone.
          </p>
        </div>

      </div>

      {/* Educational Integrity & Claims Boundaries Section */}
      <div style={{
        marginTop: '3.5rem',
        background: 'rgba(24, 24, 27, 0.8)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>⚖️</span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: '#ffffff', margin: 0 }}>
            Educational Integrity & Advertising Boundaries
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          We believe high school students, parents, and educators deserve honest and grounded expectations. We strictly avoid misleading marketing claims:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ No “Guaranteed score increase”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Actual SAT scores depend on personal dedication, foundational mastery, and official test conditions. Practice metrics are guidance estimates, never guarantees.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ No “Perfect answers”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              AI models and educational software can make mistakes. We ground hints in canonical question keys and coach students to verify intermediate steps on scratch paper.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ Never “Replace your tutor”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              This platform is an instructional assistant designed to empower tutors and teachers, not replace human mentorship, classroom educators, or school counselors.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ Does not claim “Works for every student”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Students learn differently and pacing varies. Digital practice is one component of prep, not a one-size-fits-all solution for every student.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ Never “Diagnoses learning problems”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Diagnostic feedback identifies academic test question concepts (e.g., system of equations, misplaced modifiers). It does NOT diagnose clinical learning disabilities, cognitive disorders, or medical conditions.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              ✕ No “College admission guaranteed”
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Admissions decisions are holistic institutional judgments evaluated by universities. We provide practice materials and make zero admission promises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
