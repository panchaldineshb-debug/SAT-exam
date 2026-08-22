import React from 'react';

const Features = ({ onBack }) => {
  return (
    <div className="single-pane fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <button onClick={onBack} className="back-to-dash-btn">
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--primary-color)' }}>
          Student-Centric Features
        </h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
        We've designed the SAT Prep Suite exclusively around student success. Every feature is meticulously crafted to eliminate friction, prevent study fatigue, and dynamically track your progress.
      </p>

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

        {/* Feature 2 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-emerald-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Ask AI Tutor</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Stuck on a tricky math problem? Request personalized, AI-driven explanations for any question you struggle with. Powered by AWS Bedrock for asynchronous, highly accurate, and tailored advice.
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
            A dedicated journal to track historically incorrect answers and a daily micro-challenge system to maintain engagement. Builds study consistency through focused 5-minute micro-engagements.
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
            Students can rate tests and review community difficulty ratings. This crowdsourced data helps you organically discover the most helpful or appropriately challenging practice materials based on peer feedback.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="stats-card" style={{ borderLeft: '4px solid #818cf8', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(129, 140, 248, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#818cf8' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Interactive Dashboard</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Visual charts map your score progression over time, providing transparent, data-driven insights into your strengths and weaknesses. Seamlessly tracks your journey toward mastery in Algebra 2 and Advanced Math.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Features;
