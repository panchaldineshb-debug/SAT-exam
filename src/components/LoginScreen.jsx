import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

function LoginScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('SIGN_IN'); // 'SIGN_IN', 'SIGN_UP', 'VERIFY'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signIn({ username: email, password });
      onLoginSuccess();
    } catch (err) {
      if (err.name === 'UserNotConfirmedException') {
        setMessage('Please verify your email address.');
        setMode('VERIFY');
      } else {
        setError(err.message || 'Error signing in. Please check your credentials.');
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      console.log('signUpResult:', {isSignUpComplete, nextStep});
      
      if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setMessage('Check your email for the verification code!');
        setMode('VERIFY');
      } else if (isSignUpComplete || nextStep.signUpStep === 'DONE') {
         // Some test accounts might auto-verify
         await signIn({ username: email, password });
         onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error creating account.');
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      // After confirming, sign in automatically
      await signIn({ username: email, password });
      onLoginSuccess();
    } catch (err) {
      setError('Invalid or expired verification code. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      {/* Background Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="login-glass-card">
        {mode === 'SIGN_IN' && (
          <form onSubmit={handleSignIn} className="login-form fade-in">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to your SAT Prep account</p>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="sameer@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}
            {message && <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => { setMode('SIGN_UP'); setError(''); setMessage(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === 'SIGN_UP' && (
          <form onSubmit={handleSignUp} className="login-form fade-in">
            <h2>Create Account</h2>
            <p className="login-subtitle">Join SAT Prep for free practice</p>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="sameer@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                placeholder="8+ chars, upper, lower, number" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => { setMode('SIGN_IN'); setError(''); setMessage(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === 'VERIFY' && (
          <form onSubmit={handleVerifyCode} className="login-form fade-in">
            <h2>Verify Email</h2>
            <p className="login-subtitle">We sent a verification code to {email}</p>

            <div className="input-group">
              <label htmlFor="code">Verification Code</label>
              <input 
                id="code"
                type="text" 
                placeholder="123456" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                style={{ letterSpacing: '0.2rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </div>

            {error && <div className="login-error">{error}</div>}
            {message && !error && <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}

            <button type="submit" disabled={loading || code.length < 5} className="login-btn">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => { setMode('SIGN_IN'); setError(''); setCode(''); setMessage(''); }} 
                style={{ background: 'none', border: 'none', color: '#a1a1aa', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Go back to Sign In
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#a1a1aa', textAlign: 'left', lineHeight: '1.4' }}>
          <strong>Disclaimer:</strong> This is free practice, not the real thing — nothing here guarantees your actual SAT score. We're not affiliated with the College Board. Your email is only used to log you in, nothing else. Under 18? Let a parent know you're using this. Good luck.
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
