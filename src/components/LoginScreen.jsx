import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

function LoginScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('SIGN_IN'); // 'SIGN_IN', 'SIGN_UP_AGE_GATE', 'SIGN_UP_DETAILS', 'SIGN_UP_STOP', 'VERIFY'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const currentYear = new Date().getFullYear();

  const handleAgeCheck = (e) => {
    e.preventDefault();
    if (!birthMonth || !birthYear) {
      setError("Please select both your birth month and year.");
      return;
    }
    setError('');
    
    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);
    const today = new Date();
    let age = today.getFullYear() - year;
    if (today.getMonth() + 1 < month) {
      age--;
    }

    if (age < 13) {
      setMode('SIGN_UP_STOP');
    } else {
      setMode('SIGN_UP_DETAILS');
    }
  };

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

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt <= maxRetries) {
      try {
        const { isSignUpComplete, nextStep } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              'custom:birth_month_year': `${birthYear}-${birthMonth.padStart(2, '0')}`,
              'custom:terms_version': '1.0',
              'custom:terms_accepted_at': new Date().toISOString()
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
        break; // Success, exit retry loop
      } catch (err) {
        if ((err.name === 'LimitExceededException' || err.name === 'TooManyRequestsException') && attempt < maxRetries) {
          attempt++;
          const delay = Math.pow(2, attempt - 1) * 1000 + Math.random() * 500; // Exponential backoff with jitter
          console.log(`Rate limited on signup. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          setError(err.message || 'Error creating account.');
          break; // Stop retrying on other errors or max retries
        }
      }
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
                  onClick={() => { setMode('SIGN_UP_AGE_GATE'); setError(''); setMessage(''); setBirthMonth(''); setBirthYear(''); setTermsAccepted(false); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === 'SIGN_UP_AGE_GATE' && (
          <form onSubmit={handleAgeCheck} className="login-form fade-in">
            <h2>Create Account</h2>
            <p className="login-subtitle">Step 1: When were you born?</p>

            <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="birthMonth">Month</label>
                <select 
                  id="birthMonth"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#f4f4f5', fontSize: '1rem' }}
                >
                  <option value="" disabled>Select Month</option>
                  {[...Array(12).keys()].map(i => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ flex: 1 }}>
                <label htmlFor="birthYear">Year</label>
                <select 
                  id="birthYear"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#f4f4f5', fontSize: '1rem' }}
                >
                  <option value="" disabled>Select Year</option>
                  {[...Array(100).keys()].map(i => {
                    const year = currentYear - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}
            
            <button type="submit" className="login-btn" style={{ marginTop: '1rem' }}>
              Next Step
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

        {mode === 'SIGN_UP_STOP' && (
          <div className="login-form fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#ef4444' }}>Registration Unavailable</h2>
            <p className="login-subtitle" style={{ lineHeight: '1.5', marginTop: '1rem' }}>
              We're sorry, but you are not eligible to create an account at this time. 
              To comply with the Children's Online Privacy Protection Act (COPPA), we do not collect personal information or allow account registration for users under the age of 13.
            </p>
            
            <button 
              type="button"
              className="login-btn" 
              style={{ marginTop: '2rem' }}
              onClick={() => { setMode('SIGN_IN'); setBirthMonth(''); setBirthYear(''); }}
            >
              Return to Login
            </button>
          </div>
        )}

        {mode === 'SIGN_UP_DETAILS' && (
          <form onSubmit={handleSignUp} className="login-form fade-in">
            <h2>Account Details</h2>
            <p className="login-subtitle">Step 2: Almost there!</p>

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

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', textAlign: 'left' }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: '1.4', cursor: 'pointer' }}>
                I agree to the <a href="#" onClick={(e) => { e.preventDefault(); window.open('/?view=terms', '_blank'); }} style={{ color: 'var(--primary-color)' }}>Terms of Use</a> and acknowledge the <a href="#" onClick={(e) => { e.preventDefault(); window.open('/?view=privacy', '_blank'); }} style={{ color: 'var(--primary-color)' }}>Privacy Policy</a>.
              </label>
            </div>

            {error && <div className="login-error">{error}</div>}
            
            <button type="submit" disabled={loading || !termsAccepted} className="login-btn" style={{ opacity: (!termsAccepted || loading) ? 0.5 : 1 }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => { setMode('SIGN_UP_AGE_GATE'); setError(''); }} 
                style={{ background: 'none', border: 'none', color: '#a1a1aa', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Go Back
              </button>
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

        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#a1a1aa', textAlign: 'left', lineHeight: '1.5' }}>
          <strong>Disclaimer:</strong> This is an independent educational tool for SAT practice. We are not affiliated with or endorsed by the College Board. Results are for educational purposes only and do not guarantee actual SAT scores. You must be 13 or older to use this service, and users under 18 must have parent or guardian permission.<br /><br />
          By using this service, you agree to our <a href="/terms" style={{color: '#60a5fa', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">Terms of Use</a> and acknowledge our <a href="/privacy" style={{color: '#60a5fa', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">Privacy Policy</a>. Learn more <a href="/about" style={{color: '#60a5fa', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">About Us</a>. For support or data requests, contact us at <a href="mailto:panchaldineshb@gmail.com" style={{color: '#60a5fa', textDecoration: 'none'}}>panchaldineshb@gmail.com</a>.
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
