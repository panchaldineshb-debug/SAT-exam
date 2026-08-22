import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

function TestReviewForm({ testId }) {
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [role, setRole] = useState('Student');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage("Please select a star rating.");
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const { tokens } = await fetchAuthSession();
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.idToken?.toString()}`
        },
        body: JSON.stringify({
          testId,
          rating,
          difficulty,
          role,
          comment
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#18181b', borderRadius: '8px', border: '1px solid #3f3f46', textAlign: 'center' }}>
        <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Thank you!</h3>
        <p style={{ margin: 0, color: '#a1a1aa' }}>Your review has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#18181b', borderRadius: '8px', border: '1px solid #3f3f46' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '0.5rem' }}>Rate this Practice Test</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Overall Rating</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                onClick={() => setRating(star)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '1.5rem', 
                  color: star <= rating ? '#fbbf24' : '#3f3f46' 
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Difficulty</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: '100%', padding: '8px', background: '#27272a', color: 'white', border: '1px solid #3f3f46', borderRadius: '4px' }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>I am a...</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px', background: '#27272a', color: 'white', border: '1px solid #3f3f46', borderRadius: '4px' }}
            >
              <option value="Student">Student</option>
              <option value="Teacher/Tutor">Teacher / Tutor</option>
              <option value="Parent">Parent</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Comments (Optional)</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on this test..."
            rows="3"
            style={{ width: '100%', padding: '8px', background: '#27272a', color: 'white', border: '1px solid #3f3f46', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        {errorMessage && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errorMessage}</div>}

        <button 
          type="submit" 
          disabled={status === 'loading'}
          style={{ 
            padding: '10px 16px', 
            background: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Review'}
        </button>

      </form>
    </div>
  );
}

export default TestReviewForm;
