import React, { useState, useEffect } from 'react';

function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sat_recent_students');
    if (saved) {
      setRecentStudents(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (studentName) => {
    if (!studentName.trim()) return;
    
    // Save to recent students if not already there
    const updatedRecents = [studentName, ...recentStudents.filter(n => n !== studentName)].slice(0, 5);
    localStorage.setItem('sat_recent_students', JSON.stringify(updatedRecents));
    
    onLogin(studentName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(name);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#f4f4f5' }}>
      <div style={{ backgroundColor: '#18181b', padding: '3rem', borderRadius: '8px', border: '1px solid #27272a', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '4rem', height: '4rem', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
          SP
        </div>
        <h2 style={{ fontFamily: 'Outfit', margin: '0 0 0.5rem 0' }}>SAT Prep Suite</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Enter your name to load your progress</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Student Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', fontSize: '1rem' }}
            autoFocus
          />
          <button 
            type="submit" 
            style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            disabled={!name.trim()}
          >
            Enter Practice Suite
          </button>
        </form>

        {recentStudents.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h4 style={{ color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Students</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {recentStudents.map((student) => (
                <button 
                  key={student}
                  onClick={() => handleLogin(student)}
                  style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#e4e4e7', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {student}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
