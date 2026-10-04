import React, { useState } from 'react';
import TestReviewForm from './TestReviewForm';

function ReviewMode({ test, completedInfo, onBack, onNavigate }) {
  const [showParentReport, setShowParentReport] = useState(false);

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
  const accuracyPct = Math.round((score / totalQuestions) * 100);

  // Identify missed questions and topics
  const missedQuestions = test.questions.map((q, idx) => {
    const graded = completedInfo.gradedAnswers ? completedInfo.gradedAnswers[q.id] : null;
    const chosen = graded ? graded.chosen : answers[q.id];
    const correctKey = graded ? graded.correctKey : (q.correctAnswer || "A");
    const isCorrect = graded ? graded.isCorrect : (chosen === correctKey);
    return {
      index: idx + 1,
      id: q.id,
      prompt: q.prompt,
      passage: q.passage,
      subject: q.subject || test.subject,
      topic: q.topic || (test.subject === 'math' ? 'Algebra / Advanced Math' : 'Reading & Writing Craft'),
      difficulty: q.difficulty || 'Medium',
      chosen,
      correctKey,
      isCorrect,
      explanation: graded ? graded.explanation : "Review the question solution steps."
    };
  }).filter(item => !item.isCorrect);

  const nextBestPractice = test.subject === 'math'
    ? 'Algebra 2 & Advanced Linear Systems Re-drill (Target: 1400+ mastery)'
    : 'Reading & Writing: Information & Ideas Cross-Text Sprint';

  return (
    <div className="fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Score Summary Card */}
      <div className="results-card">
        <div className="results-score-circle" style={{ borderColor: isPassing ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
          <div className="results-score-num">{score}</div>
          <div className="results-score-total">/ {totalQuestions}</div>
        </div>

        <h2 className="results-heading">
          {score === totalQuestions ? 'Perfect Score!' : isPassing ? 'Excellent Work, Student!' : 'Keep Practicing, Student!'}
        </h2>
        <p className="results-sub">
          You completed this test on {date}. Your J.P. Stevens tutor notes have been updated.
        </p>

        <div className="results-stats-row">
          <div className="results-stat-box">
            <div className="results-stat-lbl">Accuracy</div>
            <div className="results-stat-val" style={{ color: isPassing ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {accuracyPct}%
            </div>
          </div>
          <div className="results-stat-box">
            <div className="results-stat-lbl">Incorrect Answers</div>
            <div className="results-stat-val" style={{ color: 'var(--accent-rose)' }}>
              {totalQuestions - score}
            </div>
          </div>
        </div>

        {/* Controlled Assistance Section */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-active)', borderRadius: '12px', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span> Controlled Assistance & Diagnostic Guidance
          </h3>

          {completedInfo.aiAdvice ? (
            <div className="fade-in" style={{ color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {completedInfo.aiAdvice}
            </div>
          ) : (
            <div className="fade-in">
              <p style={{ color: 'var(--text-secondary)' }}>
                Your guided feedback and skill diagnostics are currently being processed in the background. Check back here in a few minutes to read your personalized study advice!
              </p>
            </div>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', alignItems: 'center' }}>
            <a href="/features" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('features', '/features'); else window.open('/features', '_blank'); }} style={{ color: '#818cf8', textDecoration: 'none' }}>
              🧠 How AI Tutoring Works
            </a>
            <span style={{ color: '#52525b' }}>•</span>
            <a href="/student-support" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('student-support', '/student-support'); else window.open('/student-support', '_blank'); }} style={{ color: '#818cf8', textDecoration: 'none' }}>
              💚 Student Support & Wellbeing
            </a>
            <span style={{ color: '#52525b' }}>•</span>
            <a href="/trust" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('trust', '/trust'); else window.open('/trust', '_blank'); }} style={{ color: '#818cf8', textDecoration: 'none' }}>
              🛡️ AI Guardrails & Trust Center
            </a>
          </div>
        </div>

        <div className="results-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="nav-btn primary" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <button 
            className="nav-btn" 
            onClick={() => setShowParentReport(true)}
            style={{ 
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(129, 140, 248, 0.3) 100%)', 
              border: '1px solid rgba(56, 189, 248, 0.5)', 
              color: '#ffffff', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span>📄</span> Generate Parent-Ready Report
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
          const graded = completedInfo.gradedAnswers ? completedInfo.gradedAnswers[q.id] : null;
          const chosen = graded ? graded.chosen : answers[q.id];
          const correctKey = graded ? graded.correctKey : "N/A";
          const isCorrect = graded ? graded.isCorrect : false;
          const explanation = graded ? graded.explanation : "Complete the test online to receive the explanation.";

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
              {explanation && (
                <div className="review-explanation-container">
                  <div className="review-explanation-title">EXPLANATION</div>
                  <div className="review-explanation-text">{explanation}</div>
                </div>
              )}
            </div>
          );
        })}

        <TestReviewForm testId={test.id} />
      </div>

      {/* Parent-Ready Progress Report Modal */}
      {showParentReport && (
        <div className="parent-report-modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto'
        }}>
          <div className="parent-report-card" style={{
            backgroundColor: '#18181b',
            color: '#f4f4f5',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            maxWidth: '750px',
            width: '100%',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Report Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-block', padding: '3px 10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Parent-Ready Diagnostic Report
                </div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', margin: 0, color: '#ffffff' }}>
                  Student Progress & Skill Mastery Summary
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', marginBottom: 0 }}>
                  Assessment: <strong>{test.title}</strong> • Completed: {date}
                </p>
              </div>
              <button 
                onClick={() => setShowParentReport(false)}
                className="review-modal-close-btn"
                style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Student Meta Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</span>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>Student (11th Grade)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>School</span>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>JP Stevens High School</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Score</span>
                <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '1rem' }}>1400+ Goal</div>
              </div>
            </div>

            {/* Performance Metric Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{score} / {totalQuestions}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>Accuracy</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{accuracyPct}%</div>
              </div>
              <div style={{ backgroundColor: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem' }}>
                  {score === totalQuestions ? 'Mastered' : isPassing ? 'Proficient' : 'Developing'}
                </div>
              </div>
            </div>

            {/* Pillar 1: Skills Missing */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <span>🔍</span> Missing Skill Analysis (Diagnostic Breakdown)
              </h4>
              {missedQuestions.length === 0 ? (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.95rem' }}>
                  ✓ Outstanding work! Zero skill gaps detected in this module. All questions were executed with full accuracy.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {missedQuestions.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid #ef4444', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#f87171' }}>Question {item.index}:</strong>{' '}
                        <span style={{ color: '#e4e4e7', fontSize: '0.9rem' }}>{item.topic}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#a1a1aa', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                        {item.difficulty} Tier
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pillar 2: Controlled Assistance Summary */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <span>🛡️</span> Controlled Assistance & Socratic Feedback
              </h4>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '8px', color: '#d4d4d8', fontSize: '0.9rem', lineHeight: '1.55', whiteSpace: 'pre-wrap' }}>
                {completedInfo.aiAdvice || "Targeted Socratic guidance provided to reinforce scratch-paper algebra, verify right triangle side ratios, and eliminate guessing."}
              </div>
            </div>

            {/* Pillar 3: Assigned Next Best Practice */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <span>⚡</span> Assigned Next Best Practice
              </h4>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b', padding: '0.85rem 1rem', borderRadius: '6px', color: '#fde68a', fontSize: '0.95rem', fontWeight: 500 }}>
                {nextBestPractice}
              </div>
            </div>

            {/* Educational Integrity & Scope Disclaimer */}
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', borderLeft: '3px solid #6366f1', fontSize: '0.8rem', color: '#a1a1aa', lineHeight: '1.5' }}>
              <strong>Educational Scope Note:</strong> This report analyzes academic test question concepts (e.g., algebra subskills, grammar rules). It does not diagnose clinical learning problems, cognitive disorders, or disabilities, and makes no score increase or college admission guarantees.
            </div>

            {/* Family Resources & Parent Rights */}
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>Family Resources:</span>
              <a href="/parent-guide" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('parent-guide', '/parent-guide'); else window.open('/parent-guide', '_blank'); }} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                👨‍👩‍👦 Parent & Guardian Guide
              </a>
              <span>•</span>
              <a href="/data-rights" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('data-rights', '/data-rights'); else window.open('/data-rights', '_blank'); }} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                📋 Data Rights & Requests
              </a>
            </div>

            {/* Footer / Print Actions */}
            <div className="review-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
              <button 
                onClick={() => setShowParentReport(false)}
                className="nav-btn"
                style={{ background: 'transparent', border: '1px solid #52525b', color: '#a1a1aa' }}
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="nav-btn primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>🖨️</span> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewMode;
