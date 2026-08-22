import React from 'react';

function AboutUs({ onBack }) {
  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: '1.6' }}>
      <button className="nav-btn" onClick={onBack} style={{ marginBottom: '2rem' }}>
        ← Back
      </button>

      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>About Us</h1>
      
      <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>Helping students practice with purpose</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        We built SAT Prep Suite to make SAT® practice more focused, approachable, and consistent.
      </p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Preparing for a high-stakes exam can feel overwhelming. Our platform helps students identify missed-question patterns, practice important skills, track progress over time, and build productive daily study habits.
      </p>

      <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>What we offer</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        SAT Prep Suite provides tools designed to support independent SAT practice:
      </p>
      <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>Practice questions and skill-based review</li>
        <li style={{ marginBottom: '0.5rem' }}>A Mistake Journal for reviewing missed questions</li>
        <li style={{ marginBottom: '0.5rem' }}>Score history and progress trends</li>
        <li style={{ marginBottom: '0.5rem' }}>A daily Problem of the Day</li>
        <li style={{ marginBottom: '0.5rem' }}>Practice benchmarks based on the reference data available in the platform</li>
        <li style={{ marginBottom: '0.5rem' }}>An AI-powered Socratic tutor that guides students through reasoning rather than simply giving answers</li>
      </ul>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-active)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        <strong>Disclaimer:</strong> Our tools are educational resources. Practice results, score estimates, and benchmarks are not official SAT scores and do not guarantee any particular result. We are not affiliated with or endorsed by the College Board.
      </div>
    </div>
  );
}

export default AboutUs;
