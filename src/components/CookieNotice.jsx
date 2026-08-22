import React, { useState, useEffect } from 'react';

function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: '#18181b',
      color: '#d4d4d8',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ flex: 1, paddingRight: '2rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
        We use essential cookies and local storage to keep you logged in and to save your preferences. 
        By continuing to use our service, you acknowledge our use of these essential functional technologies. 
      </div>
      <button 
        onClick={handleAccept}
        style={{
          backgroundColor: 'var(--primary-color)',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1.5rem',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        I Understand
      </button>
    </div>
  );
}

export default CookieNotice;
