import React from 'react';

function PrivacyPolicy({ onNavigate, onBack }) {
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
        Privacy Notice
      </h1>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>
        <span><strong>Version:</strong> 2.0</span>
        <span><strong>Last Updated:</strong> October 2026</span>
        <span><strong>Scope:</strong> SAT Prep Suite Web Application</span>
      </div>

      {/* Plain Language Summary */}
      <div style={{ backgroundColor: '#18181b', borderLeft: '4px solid #6366f1', padding: '1.25rem 1.5rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
          Plain-Language Privacy Summary
        </h3>
        <p style={{ color: '#d4d4d8', fontSize: '0.95rem', margin: 0 }}>
          We collect only what is strictly necessary to authenticate students, calculate practice SAT scores, and provide targeted Socratic feedback. We do not sell your personal information, run third-party advertisement networks, or track you across other websites.
        </p>
      </div>

      <div style={{ color: '#d4d4d8' }}>
        {/* Section 1 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          1. Information We Collect
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          We collect the minimum amount of data required to provide a functional and personalized study experience:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <strong>Account Credentials:</strong> Email address and encrypted password credentials managed exclusively via AWS Cognito.
          </li>
          <li>
            <strong>Age Gate Information:</strong> Birth Month and Birth Year (formatted as YYYY-MM) collected during registration to enforce our strict prohibition on registration for users under age 13.
          </li>
          <li>
            <strong>Academic Performance Data:</strong> Your selected answers, practice test completion dates, scores, scaled scores, and AI-assisted tutor advice logs stored in our database.
          </li>
          <li>
            <strong>In-Progress State:</strong> Active test timers and unsubmitted answers saved in your local web browser (<code>localStorage</code>) to enable test recovery if your session is interrupted.
          </li>
          <li>
            <strong>Security & Access Logs:</strong> Timestamped login records stored in DynamoDB (<code>ACTIVITY_TABLE</code>) to protect accounts against brute-force attacks and abuse.
          </li>
        </ul>

        {/* Section 2 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          2. How We Use Student Data (Purpose)
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Your data is used solely for legitimate educational and system-operational purposes:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>To display your historical practice test progress and identify weak skill areas.</li>
          <li>To power the Socratic AI Tutor by providing question context and your chosen response.</li>
          <li>To generate printable, 1-page parent-ready progress reports.</li>
          <li>To compute aggregate percentile rankings (all data is anonymized before statistical aggregation).</li>
        </ul>

        {/* Section 3 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          3. Third-Party Service Providers & Subprocessors
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          We do not sell, rent, or monetize student information to any third party. We share data only with infrastructure providers essential to operating the app:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Amazon Web Services (AWS)</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>
              Hosts our secure cloud database (DynamoDB), user authentication (Cognito), static assets (CloudFront/S3), and serverless execution (Lambda).
            </p>
          </div>
          <div style={{ backgroundColor: '#131316', border: '1px solid #27272a', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Anthropic (via AWS Bedrock)</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>
              Generates asynchronous advice for completed practice tests via Claude Haiku. Data sent to Bedrock is not used to train public foundation models.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          4. Data Retention & Account Deletion
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          We retain your practice history for as long as your account is active. You have the right to request deletion at any time:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <strong>Self-Service Deletion:</strong> Clicking <em>“Delete Account”</em> in your student dashboard triggers our automated deletion endpoint (<code>DELETE /account</code>), permanently erasing your user account from AWS Cognito.
          </li>
          <li>
            <strong>Written Requests:</strong> You or your legal guardian may submit a formal data deletion or export request via our <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} style={{ color: '#818cf8' }}>Data Rights Page</a>. Written requests are processed within 30 calendar days at no charge.
          </li>
        </ul>

        {/* Section 5 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          5. Children's Privacy & Age Gate (13+)
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          This service is designed exclusively for high school students preparing for the SAT. We do not knowingly permit registration by or collect personal data from children under the age of 13. Registration is strictly blocked in both client validation and backend Lambda triggers if the birth month/year calculates to an age under 13. If you believe an under-13 user has registered, contact us immediately for prompt deletion.
        </p>

        {/* Section 6 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          6. Legal & Regulatory Status
        </h2>
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ color: '#fef08a', fontSize: '0.9rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            Notice Regarding Institutional Certifications [Pending Qualified Legal Review]
          </p>
          <p style={{ color: '#d4d4d8', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
            We implement privacy-by-design principles, technical age verification, and zero third-party advertising cookies. However, this independent platform has not undergone formal third-party audit for FTC-approved COPPA Safe Harbor seals or school-district institutional FERPA contracts. These formal designations are labeled as pending qualified legal review.
          </p>
        </div>

        {/* Section 7 */}
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
          7. Contact Information
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          For privacy inquiries, parental rights requests, or data corrections, contact the platform administrator directly at <a href="mailto:panchaldineshb@gmail.com" style={{ color: '#818cf8' }}>panchaldineshb@gmail.com</a> or visit our <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} style={{ color: '#818cf8' }}>Contact & Safety Page</a>.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
