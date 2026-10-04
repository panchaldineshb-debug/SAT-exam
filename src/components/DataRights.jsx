import React, { useState } from 'react';

function DataRights({ onNavigate, onBack }) {
  const [requestType, setRequestType] = useState('DELETE');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    // Simulate submission / show confirmation and mailto fallback
    setSubmitted(true);
  };

  return (
    <div className="data-rights-container fade-in" style={{
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <span>📋</span> Privacy Controls & Self-Service
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.3rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Data Rights & Privacy Requests
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
          Version 2.0 • Last Updated: October 2026 • Policy Owner: Privacy & Data Governance Desk
        </p>
      </div>

      {/* Summary Box */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginTop: 0, marginBottom: '0.75rem', fontFamily: 'var(--font-title)' }}>
          Your Rights Over Your Data
        </h2>
        <p style={{ color: '#d4d4d8', fontSize: '1rem', margin: '0 0 1rem 0' }}>
          We believe in giving students and parents complete autonomy over their educational records. You have the right to inspect, export, and permanently delete your information at any time without fees or dark patterns.
        </p>
      </div>

      {/* Quick Self-Service Deletion Guide */}
      <div style={{
        backgroundColor: '#131316',
        border: '1px solid #3f3f46',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
            Instant Self-Service Account Deletion
          </h3>
        </div>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '1rem' }}>
          If you are logged into your account, you do not need to wait for manual email processing:
        </p>
        <ol style={{ color: '#d4d4d8', paddingLeft: '1.5rem', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
          <li style={{ marginBottom: '0.35rem' }}>Navigate to your <strong>Student Dashboard</strong>.</li>
          <li style={{ marginBottom: '0.35rem' }}>Look for the red <strong>“Delete Account”</strong> button located in the dashboard sidebar.</li>
          <li style={{ marginBottom: '0.35rem' }}>Confirm the deletion prompt. The application invokes our AWS Cognito deletion endpoint (<code>DELETE /account</code>), permanently removing your user credentials.</li>
        </ol>
      </div>

      {/* Data Categories Table */}
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: '#fff', marginBottom: '1rem' }}>
        What Data We Store & Retention Periods
      </h2>

      <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', color: '#d4d4d8' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #27272a', backgroundColor: '#18181b', color: '#ffffff' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Data Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Specific Fields</th>
              <th style={{ padding: '0.75rem 1rem' }}>Purpose</th>
              <th style={{ padding: '0.75rem 1rem' }}>Storage & Retention</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f4f4f5' }}>Authentication</td>
              <td style={{ padding: '0.75rem 1rem' }}>Email address, password hash (Cognito managed), Cognito Sub ID</td>
              <td style={{ padding: '0.75rem 1rem' }}>Account security and login authentication</td>
              <td style={{ padding: '0.75rem 1rem' }}>AWS Cognito; retained until account deletion</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f4f4f5' }}>Age Verification</td>
              <td style={{ padding: '0.75rem 1rem' }}>Birth Month and Birth Year (YYYY-MM)</td>
              <td style={{ padding: '0.75rem 1rem' }}>Enforce age gate prohibiting registration under age 13</td>
              <td style={{ padding: '0.75rem 1rem' }}>AWS Cognito custom attribute; deleted with account</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f4f4f5' }}>Academic Progress</td>
              <td style={{ padding: '0.75rem 1rem' }}>Practice test answers, scores, timestamps, AI feedback text</td>
              <td style={{ padding: '0.75rem 1rem' }}>Display score history and generate diagnostic reports</td>
              <td style={{ padding: '0.75rem 1rem' }}>DynamoDB (<code>PROGRESS_TABLE</code>); retained while active</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f4f4f5' }}>Session State</td>
              <td style={{ padding: '0.75rem 1rem' }}>In-progress test answers, timer, cookie consent flag</td>
              <td style={{ padding: '0.75rem 1rem' }}>Allow resuming interrupted tests and remembering consent</td>
              <td style={{ padding: '0.75rem 1rem' }}>Browser <code>localStorage</code>; cleared on browser cache clear</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f4f4f5' }}>Security Logs</td>
              <td style={{ padding: '0.75rem 1rem' }}>Login date, timestamp, email, action ("LOGIN")</td>
              <td style={{ padding: '0.75rem 1rem' }}>Audit logging and account abuse prevention</td>
              <td style={{ padding: '0.75rem 1rem' }}>DynamoDB (<code>ACTIVITY_TABLE</code>); retained for security audit</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Interactive Request Form */}
      <div style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: '#fff', marginTop: 0, marginBottom: '0.75rem' }}>
          Submit a Written Privacy or Data Request
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          If you are unable to use self-service deletion, need an official data export, or are a parent requesting records on behalf of your student, submit the form below. We respond within 30 calendar days.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <h3 style={{ color: '#34d399', margin: '0 0 0.5rem 0' }}>Request Prepared Successfully</h3>
            <p style={{ color: '#d4d4d8', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
              Your request details have been formatted. To ensure verified delivery, please email your request directly to our privacy desk:
            </p>
            <a 
              href={`mailto:panchaldineshb@gmail.com?subject=Data%20Privacy%20Request%20(${requestType})&body=Requester%20Email:%20${encodeURIComponent(requesterEmail)}%0AStudent%20Username:%20${encodeURIComponent(studentUsername)}%0ARequest%20Type:%20${encodeURIComponent(requestType)}%0ADetails:%20${encodeURIComponent(requestDetails)}`}
              className="nav-btn primary"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Open Email Client to Send (panchaldineshb@gmail.com)
            </a>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => setSubmitted(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Submit another request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="reqType" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                Request Type *
              </label>
              <select
                id="reqType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
              >
                <option value="DELETE">Permanent Account & Data Deletion</option>
                <option value="EXPORT">Data Export / Access Request (JSON/CSV summary)</option>
                <option value="PARENT_INQUIRY">Parent / Guardian Record Review</option>
                <option value="CORRECTION">Correction of Account Information</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="reqEmail" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                  Your Contact Email *
                </label>
                <input
                  id="reqEmail"
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="parent_or_student@example.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label htmlFor="studentUser" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                  Student Account Email or Username
                </label>
                <input
                  id="studentUser"
                  type="text"
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  placeholder="student@example.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reqDetails" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: '#e4e4e7' }}>
                Additional Details / Notes
              </label>
              <textarea
                id="reqDetails"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                rows={3}
                placeholder="Provide any specific details (e.g. 'I am the legal guardian of this student and request export of all test dates and scores')."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#131316', color: '#f4f4f5', fontSize: '0.95rem' }}
              />
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: '0.5rem' }}>
              Prepare & Submit Data Request
            </button>
          </form>
        )}
      </div>

      {/* Legal Status Note */}
      <div style={{ backgroundColor: 'rgba(24, 24, 27, 0.6)', border: '1px solid #27272a', borderRadius: '10px', padding: '1.25rem' }}>
        <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>
          <strong>Backup & Archive Policy [Pending Qualified Legal Review]:</strong> Self-service deletion via <code>DELETE /account</code> removes user access and identity credentials in AWS Cognito immediately. Residual encrypted snapshots and operational DynamoDB logs are overwritten in accordance with standard AWS retention cycles (up to 35 days). Automated simultaneous cascade purging across all historical audit tables is currently undergoing technical validation.
        </p>
      </div>

      {/* Helpful Links */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/trust" onClick={(e) => handleNav(e, 'trust', '/trust')} className="nav-btn" style={{ background: '#27272a', color: '#fff', textDecoration: 'none' }}>
          ← Trust Center
        </a>
        <a href="/parent-guide" onClick={(e) => handleNav(e, 'parent-guide', '/parent-guide')} className="nav-btn" style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', textDecoration: 'none' }}>
          Parent Guide
        </a>
        <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} className="nav-btn" style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', textDecoration: 'none' }}>
          Contact & Safety
        </a>
      </div>
    </div>
  );
}

export default DataRights;
