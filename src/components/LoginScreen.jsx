import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

function LoginScreen({ onLoginSuccess }) {
  const [authState, setAuthState] = useState('SIGN_IN'); // 'SIGN_IN', 'SIGN_UP', 'CONFIRM'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (isSignedIn) {
        onLoginSuccess();
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setAuthState('CONFIRM');
      }
    } catch (err) {
      setError(err.message || 'Error signing in');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        }
      });
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setAuthState('CONFIRM');
      } else if (isSignUpComplete) {
        setAuthState('SIGN_IN');
      }
    } catch (err) {
      setError(err.message || 'Error signing up');
    }
    setLoading(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode
      });
      if (isSignUpComplete) {
        // Automatically sign them in
        await signIn({ username: email, password });
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error confirming code');
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
        {authState === 'SIGN_IN' && (
          <form onSubmit={handleSignIn} className="login-form fade-in">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue your SAT prep</p>

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
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="login-switch">
              Don't have an account? <span onClick={() => { setAuthState('SIGN_UP'); setError(''); }}>Sign Up</span>
            </p>
          </form>
        )}

        {authState === 'SIGN_UP' && (
          <form onSubmit={handleSignUp} className="login-form fade-in">
            <h2>Create Account</h2>
            <p className="login-subtitle">Join SarabiLabs SAT Prep</p>

            <div className="input-group">
              <label htmlFor="signup-email">Email</label>
              <input 
                id="signup-email"
                type="email" 
                placeholder="sameer@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="signup-password">Password</label>
              <div className="password-wrapper">
                <input 
                  id="signup-password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>

            <p className="login-switch">
              Already have an account? <span onClick={() => { setAuthState('SIGN_IN'); setError(''); }}>Sign In</span>
            </p>
          </form>
        )}

        {authState === 'CONFIRM' && (
          <form onSubmit={handleConfirm} className="login-form fade-in">
            <h2>Verify Email</h2>
            <p className="login-subtitle">We sent a verification code to {email}</p>

            <div className="input-group">
              <label htmlFor="code">Confirmation Code</label>
              <input 
                id="code"
                type="text" 
                placeholder="123456" 
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <p className="login-switch">
              <span onClick={() => { setAuthState('SIGN_IN'); setError(''); }}>Back to Sign In</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
