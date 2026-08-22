import React from 'react';

function PrivacyPolicy({ onBack }) {
  return (
    <div className="practice-container fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#f4f4f5' }}>
      <button 
        onClick={onBack} 
        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
      >
        <span>← Back</span>
      </button>

      <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Privacy Policy</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Last Updated: August 2026</p>

      <div style={{ lineHeight: '1.6', color: '#d4d4d8' }}>
        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>1. Data We Collect</h2>
        <p>
          We collect the minimum amount of data necessary to provide you with a personalized educational experience. This includes:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Account Information:</strong> Your email address, used exclusively for login and authentication.</li>
          <li><strong>Performance Data:</strong> Your SAT practice test scores, question-level answers, and review history.</li>
          <li><strong>Usage Data:</strong> Basic application usage metrics (like logins and test submissions) to ensure system reliability.</li>
        </ul>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Data (Purpose)</h2>
        <p>
          Your data is used strictly for educational purposes within this application:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>To track your practice progress over time.</li>
          <li>To power the "Ask AI Tutor" feature, providing customized feedback on your mistakes.</li>
          <li>To calculate global percentile rankings (your individual data is anonymized before being aggregated).</li>
        </ul>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>3. Third-Party Processors</h2>
        <p>
          We do not sell your data. We share necessary data with trusted cloud providers strictly to operate the service:
        </p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Amazon Web Services (AWS):</strong> For secure database hosting and user authentication (Cognito).</li>
          <li><strong>Anthropic (via Amazon Bedrock):</strong> When you use the "Ask AI Tutor" feature, the specific question and your answer are securely sent to the Claude AI model to generate feedback. The AI model is strictly prohibited from using your data to train its models.</li>
        </ul>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>4. Security & Retention</h2>
        <p style={{ marginBottom: '1rem' }}>
          Your data is encrypted in transit and at rest. We utilize AWS Point-in-Time Recovery to prevent data loss. We retain your performance data as long as your account is active so you can review your history.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>5. Children's Privacy</h2>
        <p style={{ marginBottom: '1rem' }}>
          This service is designed for high school students preparing for the SAT. We do not knowingly collect or maintain personal information from children under the age of 13. Registration is strictly blocked for users under 13. If we learn that we have collected personal information from a child under 13, we will delete that information immediately.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>6. Data Deletion & Contact</h2>
        <p style={{ marginBottom: '1rem' }}>
          You have the right to request the deletion of your account and all associated data at any time. For data deletion requests, or if you have any questions about this Privacy Policy, please contact the site administrator.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
