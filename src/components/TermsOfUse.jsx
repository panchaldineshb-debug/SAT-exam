import React from 'react';

function TermsOfUse({ onBack }) {
  return (
    <div className="practice-container fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#f4f4f5' }}>
      <button 
        onClick={onBack} 
        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
      >
        <span>← Back</span>
      </button>

      <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Terms of Use</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Last Updated: August 2026</p>

      <div style={{ lineHeight: '1.6', color: '#d4d4d8' }}>
        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>1. Educational Purpose Only</h2>
        <p style={{ marginBottom: '1rem' }}>
          This application is provided strictly for educational and practice purposes. It is designed to help students prepare for the SAT exam by offering practice materials and AI-assisted feedback.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>2. No Score Guarantee</h2>
        <p style={{ marginBottom: '1rem' }}>
          While our practice tests and scoring algorithms aim to simulate the real testing environment, we make absolutely no guarantees regarding your actual performance on the official SAT. Your practice scores here are estimates and do not represent official College Board scoring.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>3. User Responsibilities</h2>
        <p>By using this service, you agree to:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Use the platform respectfully and for its intended educational purpose.</li>
          <li>Not attempt to exploit, hack, or overload the application infrastructure.</li>
          <li>Not input sensitive, offensive, or personally identifiable information into the AI Tutor interface.</li>
        </ul>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h2>
        <p style={{ marginBottom: '1rem' }}>
          SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this product. All practice questions and materials provided are either original educational content or used under fair use for educational simulation. You may not scrape, copy, or distribute the application's underlying code or question banks.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
        <p style={{ marginBottom: '1rem' }}>
          We provide this service on an "as-is" basis. We are not liable for any service interruptions, data loss, or any direct or indirect consequences arising from your use of this application, including college admission outcomes.
        </p>

        <h2 style={{ fontFamily: 'Outfit', color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>6. Termination</h2>
        <p style={{ marginBottom: '1rem' }}>
          We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </div>
    </div>
  );
}

export default TermsOfUse;
