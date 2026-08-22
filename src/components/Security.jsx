import React from 'react';

const Security = ({ onBack }) => {
  return (
    <div className="single-pane fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <button onClick={onBack} className="back-to-dash-btn">
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--accent-emerald)' }}>
          Security & Architecture
        </h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
        Student safety and platform security are treated with absolute zero-trust brutality. Here is how we guarantee a safe environment for your educational journey.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Architecture 1 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-rose-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-rose)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Prompt Injection Defense (AI Sandbox)</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            The "Ask AI Tutor" executes in an asynchronous SQS queue sandbox. It has zero access to deployment keys, production state, or broad database write permissions. Even if a student tries to hijack the AI via prompt injection, the execution environment is untrusted and isolated.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure Agent Pattern</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#ef4444' }}>■</span> Untrusted input / web page / document</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#3b82f6' }}>■</span> Content isolation + provenance labels</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#8b5cf6' }}>■</span> LLM proposes a structured action</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#eab308' }}>■</span> Server-side policy engine validates user, scope, parameters, and risk</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#f97316' }}>■</span> Human approval if action is consequential</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#10b981' }}>■</span> Sandboxed, least-privilege tool executes action</div>
              <div style={{ paddingLeft: '0.25rem', color: '#52525b' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}><span style={{ color: '#64748b' }}>■</span> Audit log</div>
            </div>
          </div>
        </div>

        {/* Architecture 2 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Microservice Least Privilege</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Every backend feature (e.g., scoring, rating, AI advice) operates via a dedicated AWS Lambda function with strict IAM execution roles. For example, the scoring Lambda can only read, not write. If one microservice is theoretically compromised, the blast radius is strictly contained.
          </p>
        </div>

        {/* Architecture 3 */}
        <div className="stats-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-emerald-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Hardened CI/CD Deployments</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            No human developer or AI coding agent has direct deployment access to the production environment. All updates are forced through a protected GitHub Actions CI/CD pipeline using ephemeral OIDC authentication. The local development environment cannot directly mutate production infrastructure.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Security;
