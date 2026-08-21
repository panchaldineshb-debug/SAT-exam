import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function MarkdownDrill({ drillPath, onBack }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for user answers
  const [userAnswers, setUserAnswers] = useState({});
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    fetch(drillPath)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load drill');
        return res.text();
      })
      .then(text => {
        setContent(text);
        
        // Count questions (lines starting with '### Question')
        const matches = text.match(/### Question \d+/g);
        setQuestionCount(matches ? matches.length : 0);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [drillPath]);

  const handleAnswerChange = (qIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [qIndex]: answer
    }));
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart? All current answers will be cleared.")) {
      setUserAnswers({});
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Drill...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Error loading drill</h2>
        <p>{error}</p>
        <button className="back-btn" onClick={onBack}>Return to Dashboard</button>
      </div>
    );
  }

  // Generate answer sheet
  const renderBubbleSheet = () => {
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
      questions.push(
        <div key={i} className="bubble-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ width: '30px', fontWeight: 'bold' }}>Q{i}.</span>
          {['A', 'B', 'C', 'D'].map(opt => (
            <button
              key={opt}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: userAnswers[i] === opt ? '#3b82f6' : '#27272a',
                color: userAnswers[i] === opt ? 'white' : '#a1a1aa',
                border: '1px solid #3f3f46', cursor: 'pointer'
              }}
              onClick={() => handleAnswerChange(i, opt)}
            >
              {opt}
            </button>
          ))}
          <input 
            type="text" 
            placeholder="Grid-in" 
            value={!['A','B','C','D'].includes(userAnswers[i]) ? userAnswers[i] || '' : ''}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            style={{ 
              background: '#27272a', border: '1px solid #3f3f46', 
              color: 'white', padding: '4px 8px', borderRadius: '4px', width: '80px' 
            }}
          />
        </div>
      );
    }
    return questions;
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {/* Left panel: Markdown Content */}
      <div style={{ flex: '1', overflowY: 'auto', padding: '2rem', borderRight: '1px solid #27272a' }}>
        <button 
          onClick={onBack}
          style={{ marginBottom: '1rem', background: '#3f3f46', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <div className="markdown-body" style={{ color: '#f4f4f5', lineHeight: '1.6' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Right panel: Bubble Sheet */}
      <div style={{ width: '350px', padding: '1.5rem', overflowY: 'auto', backgroundColor: '#18181b' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '0.5rem' }}>Answer Sheet</h3>
        {questionCount > 0 ? (
          <div>
            {renderBubbleSheet()}
            <button 
              style={{ width: '100%', marginTop: '1rem', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => alert('Drill completed! (Note: Answers are saved locally but not automatically graded for Markdown drills)')}
            >
              Submit Drill
            </button>
            <button 
              style={{ width: '100%', marginTop: '0.5rem', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={handleRestart}
            >
              Restart Drill
            </button>
          </div>
        ) : (
          <p>No questions detected.</p>
        )}
      </div>
    </div>
  );
}

export default MarkdownDrill;
