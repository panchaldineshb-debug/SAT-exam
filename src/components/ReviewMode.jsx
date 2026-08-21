import React from 'react';

function ReviewMode({ test, completedInfo, onBack }) {
  if (!completedInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <h3>No completion data found for this test.</h3>
        <button className="nav-btn primary" onClick={onBack} style={{ margin: '1.5rem auto' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { score, answers, totalQuestions, date } = completedInfo;
  const isPassing = score >= 7; // Arbitrary 70% threshold

  return (
    <div className="fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Score Summary Card */}
      <div className="results-card">
        <div className="results-score-circle" style={{ borderColor: isPassing ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
          <div className="results-score-num">{score}</div>
          <div className="results-score-total">/ {totalQuestions}</div>
        </div>
        
        <h2 className="results-heading">
          {score === 10 ? 'Perfect Score!' : isPassing ? 'Excellent Work, Sameer!' : 'Keep Practicing, Sameer!'}
        </h2>
        <p className="results-sub">
          You completed this test on {date}. Your J.P. Stevens tutor notes have been updated.
        </p>

        <div className="results-stats-row">
          <div className="results-stat-box">
            <div className="results-stat-lbl">Accuracy</div>
            <div className="results-stat-val" style={{ color: isPassing ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {Math.round((score / totalQuestions) * 100)}%
            </div>
          </div>
          <div className="results-stat-box">
            <div className="results-stat-lbl">Incorrect Answers</div>
            <div className="results-stat-val" style={{ color: 'var(--accent-rose)' }}>
              {totalQuestions - score}
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button className="nav-btn primary" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Review Details Header */}
      <h3 className="review-header-text">
        <span>🔍</span> Question-by-Question Review
      </h3>

      {/* Questions Review List */}
      <div>
        {test.questions.map((q, idx) => {
          const chosen = answers[q.id];
          const correctKey = q.key.trim();
          
          // Determine correctness
          // Normalize comparison (ignore case, spaces, and commas)
          const normChosen = chosen ? chosen.trim().toLowerCase().replace(/,/g, '') : '';
          const normKey = correctKey.toLowerCase().replace(/,/g, '');
          const isCorrect = normChosen === normKey;
          
          const isMultipleChoice = q.options && q.options.length > 0;

          return (
            <div key={q.id} className="review-item-card fade-in">
              {/* Question metadata header */}
              <div className="review-item-meta">
                <span className="review-item-title">Question {idx + 1}</span>
                <span className={`review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              {/* Display Reading Passage if it exists */}
              {q.passage && (
                <div className="review-passage">{q.passage}</div>
              )}

              {/* Question Prompt */}
              <div className="review-prompt">{q.prompt}</div>

              {/* Choices / Answers */}
              {isMultipleChoice ? (
                /* Multiple Choice Choices */
                <div className="options-list" style={{ marginBottom: '1.5rem' }}>
                  {q.options.map((opt, oIdx) => {
                    const letter = opt.trim().substring(0, 1);
                    const isUserChoice = chosen === letter;
                    const isCorrectChoice = correctKey === letter;
                    
                    let cardClass = '';
                    let showIndicator = false;
                    
                    if (isCorrectChoice) {
                      cardClass = 'correct';
                      showIndicator = true;
                    } else if (isUserChoice && !isCorrect) {
                      cardClass = 'incorrect';
                      showIndicator = true;
                    }

                    return (
                      <div key={oIdx} className={`review-choice-card ${cardClass}`}>
                        {showIndicator ? (
                          <div className={`review-choice-indicator ${isCorrectChoice ? 'correct' : 'incorrect'}`}>
                            {isCorrectChoice ? '✓' : '✗'}
                          </div>
                        ) : (
                          <div style={{ width: '20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {letter}
                          </div>
                        )}
                        <div className="review-choice-text">{opt}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Grid-In Response Summary */
                <div className="review-answers-summary">
                  <div className="review-answers-item">
                    Your Answer: <span className={isCorrect ? 'correct' : 'incorrect'}>{chosen || '(No Answer)'}</span>
                  </div>
                  <div className="review-answers-item">
                    Correct Answer: <span className="correct">{correctKey}</span>
                  </div>
                </div>
              )}

              {/* Answer Explanation Box */}
              {q.explanation && (
                <div className="review-explanation-container">
                  <div className="review-explanation-title">EXPLANATION</div>
                  <div className="review-explanation-text">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewMode;
