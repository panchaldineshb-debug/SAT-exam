import React, { useState } from 'react';

function ContactSafety({ onNavigate, onBack }) {
  const [category, setCategory] = useState('AI_ACCURACY');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="contact-page-container fade-in" style={{
      maxWidth: '900px',
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

      {/* Main Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <span>📬</span> Direct Communication & Safety Reporting
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.3rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Contact, Feedback & Safety Concerns
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
          Version 2.0 • Last Updated: October 2026 • Administrator: Dinesh Panchal
        </p>
      </div>

      {/* Emergency Notice Callout */}
      <div style={{
        backgroundColor: '#1f1315',
        border: '1px solid #ef4444',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
          <span>🚨</span> Immediate Emergency / Crisis Notice
        </div>
        <p style={{ color: '#fecaca', fontSize: '0.9rem', margin: 0 }}>
          This contact form is monitored for administrative and educational inquiries, not emergency medical or psychiatric triage. If you or someone you know is in immediate crisis, call or text <strong>988</strong> (US Suicide & Crisis Lifeline) or call <strong>911</strong> immediately.
        </p>
      </div>

      {/* Direct Contact Card */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '0.75rem' }}>
          Direct Contact Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ color: '#71717a', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>General & Safety Email</div>
            <div style={{ color: '#60a5fa', fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <a href="mailto:panchaldineshb@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                panchaldineshb@gmail.com
              </a>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Response timeframe: Within 24–48 hours for academic or accuracy reports; within 30 days for formal privacy requests.
            </p>
          </div>

          <div>
            <div style={{ color: '#71717a', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mailing & Operations</div>
            <div style={{ color: '#f4f4f5', fontSize: '0.95rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
              SAT Prep Suite Desk<br />
              Edison, NJ 08820
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Reporting Form */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '0.5rem' }}>
          Send a Report or Concern
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Use this form to flag an incorrect AI Tutor explanation, report a broken problem, or ask a question.
        </p>

        {isSent ? (
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
            <h3 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Report Formatted</h3>
            <p style={{ color: '#d4d4d8', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
              Click below to dispatch your message via your email client to our review queue:
            </p>
            <a 
              href={`mailto:panchaldineshb@gmail.com?subject=${encodeURIComponent(`[SAT Suite Report] ${category}`)}&body=${encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\nQuestion ID (if applicable): ${questionId}\n\nMessage:\n${message}`)}`}
              className="nav-btn primary"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Open Email (panchaldineshb@gmail.com)
            </a>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => setIsSent(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="category" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                Reason for Contact *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
              >
                <option value="AI_ACCURACY">Report Incorrect AI Tutor Output or Explanation</option>
                <option value="CANONICAL_KEY_ERROR">Report Suspected Answer Key Error in Test Question</option>
                <option value="PRIVACY_CONCERN">Student Privacy / Account Data Inquiry</option>
                <option value="PARENT_INQUIRY">Parent / Guardian Feedback</option>
                <option value="GENERAL_FEEDBACK">General Question or Suggestion</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="senderName" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                  Your Name *
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Student or Parent Name"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label htmlFor="senderEmail" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                  Your Email *
                </label>
                <input
                  id="senderEmail"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {category.includes('AI_ACCURACY') || category.includes('CANONICAL') ? (
              <div>
                <label htmlFor="questionId" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                  Question ID or Test Name (e.g., verbal-1:1, math-4:7)
                </label>
                <input
                  id="questionId"
                  type="text"
                  value={questionId}
                  onChange={(e) => setQuestionId(e.target.value)}
                  placeholder="e.g. math-1:5"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="message" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                Description of Concern or Feedback *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Please describe what happened, what the tutor stated, or what you would like addressed."
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
              />
            </div>

            <button type="submit" className="login-btn">
              Prepare & Send Concern
            </button>
          </form>
        )}
      </div>

      {/* Helpful Links Row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/trust" onClick={(e) => handleNav(e, 'trust', '/trust')} className="nav-btn" style={{ background: '#27272a', color: '#fff', textDecoration: 'none' }}>
          ← Back to Trust Center
        </a>
        <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} className="nav-btn" style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', textDecoration: 'none' }}>
          Data Rights & Requests
        </a>
      </div>
    </div>
  );
}

export default ContactSafety;
