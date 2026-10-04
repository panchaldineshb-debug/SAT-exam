import React from 'react';

function AboutUs({ onBack }) {
  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: '1.6' }}>
      <button className="nav-btn" onClick={onBack} style={{ marginBottom: '2rem' }}>
        ← Back
      </button>

      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>About Us</h1>
      
      <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>Helping Students Practice with Purpose</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        We built SAT Prep Suite to make digital SAT® practice more focused, approachable, and consistent.
      </p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Preparing for a high-stakes exam can feel overwhelming. Our platform helps students identify missed-question patterns, practice critical skills across Foundations, Medium, and Advanced levels, track progress over time, and build productive daily study habits.
      </p>

      {/* Tutor & Educator Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.12) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem'
      }}>
        <h2 style={{ color: '#fff', fontSize: '1.35rem', marginTop: 0, marginBottom: '0.75rem' }}>
          Our Core Pitch to Tutors & Educators
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Our pitch to tutors is never generic “AI tutoring.” It is:
        </p>
        <blockquote style={{
          margin: '0 0 1rem 0',
          padding: '1rem 1.25rem',
          borderLeft: '4px solid var(--primary-color)',
          backgroundColor: 'rgba(24, 24, 27, 0.8)',
          borderRadius: '0 8px 8px 0',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '1.15rem',
          lineHeight: '1.5'
        }}>
          “A system that shows which skill each student is missing, gives controlled assistance, assigns the next best practice, and generates a parent-ready progress report in minutes.”
        </blockquote>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          By keeping tutors in full control while automating diagnostic tracking, anti-guessing safeguards, and parent communication, educators can focus on deep, high-impact instruction.
        </p>
      </div>

      <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>What We Offer</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        SAT Prep Suite provides tools designed to support both independent student practice and tutor-led coaching:
      </p>
      <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>Full-length timed practice tests and skill-based review modules</li>
        <li style={{ marginBottom: '0.5rem' }}>Skill-level categorization across Foundations, Medium, and Advanced tiers</li>
        <li style={{ marginBottom: '0.5rem' }}>A persistent Mistake Journal to review and resolve missed questions</li>
        <li style={{ marginBottom: '0.5rem' }}>Controlled assistance that guides students through reasoning without handing out direct answers</li>
        <li style={{ marginBottom: '0.5rem' }}>Adaptive "Next Best Practice" recommendations tailored to individual weak spots</li>
        <li style={{ marginBottom: '0.5rem' }}>Score history, benchmark percentiles, and instant parent-ready progress summaries</li>
        <li style={{ marginBottom: '0.5rem' }}>Daily Problem of the Day micro-challenges to sustain daily consistency</li>
      </ul>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-active)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
        <strong>Educational Integrity Notice:</strong> Our tools are independent practice resources. We strictly avoid misleading marketing claims: we do not promise guaranteed score increases or college admission, do not claim infallible AI answers, do not replace tutors or classroom teachers, do not claim universal efficacy for every student, and do not diagnose clinical learning problems or disabilities. All references to the SAT® are for nominative educational purposes; we are not affiliated with or endorsed by the College Board.
      </div>
    </div>
  );
}

export default AboutUs;
