import React from 'react';

function Footer({ onNavigate }) {
  const handleNav = (e, view, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <footer className="public-footer" style={{
      backgroundColor: '#0c0c0e',
      borderTop: '1px solid #27272a',
      color: '#a1a1aa',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
      fontSize: '0.9rem',
      lineHeight: '1.6'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Column 1: Trust & Safety */}
        <div>
          <div style={{ color: '#f4f4f5', fontWeight: 600, fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🛡️</span> Trust & Wellbeing
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <a href="/trust" onClick={(e) => handleNav(e, 'trust', '/trust')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Trust Center
              </a>
            </li>
            <li>
              <a href="/student-support" onClick={(e) => handleNav(e, 'student-support', '/student-support')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Student Support & Crisis Info
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => handleNav(e, 'contact', '/contact')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Contact & Report a Concern
              </a>
            </li>
            <li>
              <a href="/features" onClick={(e) => handleNav(e, 'features', '/features')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                How AI Tutoring Works
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Parents & Data Rights */}
        <div>
          <div style={{ color: '#f4f4f5', fontWeight: 600, fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👨‍👩‍👦</span> Parents & Privacy
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <a href="/parent-guide" onClick={(e) => handleNav(e, 'parent-guide', '/parent-guide')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Parent & Guardian Guide
              </a>
            </li>
            <li>
              <a href="/data-rights" onClick={(e) => handleNav(e, 'data-rights', '/data-rights')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Data Rights & Requests
              </a>
            </li>
            <li>
              <a href="/privacy" onClick={(e) => handleNav(e, 'privacy', '/privacy')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Privacy Notice
              </a>
            </li>
            <li>
              <a href="/terms" onClick={(e) => handleNav(e, 'terms', '/terms')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform & Security */}
        <div>
          <div style={{ color: '#f4f4f5', fontWeight: 600, fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔒</span> Architecture & Mission
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <a href="/security" onClick={(e) => handleNav(e, 'security', '/security')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                Security Architecture
              </a>
            </li>
            <li>
              <a href="/about" onClick={(e) => handleNav(e, 'about', '/about')} style={{ color: '#d4d4d8', textDecoration: 'none' }} className="footer-link">
                About Us
              </a>
            </li>
            <li>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>
                Audited Canonical Question Bank • 600+ Grounded Items
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Urgent Wellbeing Note */}
        <div>
          <div style={{ color: '#f4f4f5', fontWeight: 600, fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🆘</span> Wellbeing Resources
          </div>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 0.5rem 0' }}>
            If you or someone you know is in crisis or distress, please reach out for immediate, free, confidential support:
          </p>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.85rem', color: '#fca5a5' }}>
            <strong>US Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong> (24/7).<br />
            <strong>Crisis Text Line:</strong> Text <strong>HOME</strong> to <strong>741741</strong>.
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1f1f23',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.8rem',
        color: '#71717a'
      }}>
        <div>
          © {new Date().getFullYear()} SAT Prep Suite. An independent educational practice tool.
        </div>
        <div style={{ maxWidth: '650px', textAlign: 'right' }}>
          SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
