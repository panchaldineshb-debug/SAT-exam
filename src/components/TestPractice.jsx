import React from 'react';

function TestPractice({
  test,
  userAnswers,
  setUserAnswers,
  remainingTime,
  activeQuestionIndex,
  setActiveQuestionIndex,
  onQuit,
  onSubmit
}) {
  const currentQuestion = test.questions[activeQuestionIndex];

  // Helper to format remaining time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isTimeWarning = remainingTime < 300; // under 5 minutes

  // Option selection handler for multiple choice
  const handleOptionSelect = (optionLabel) => {
    // Extract the option letter from optionLabel (e.g., "A. speculates" -> "A")
    const optionLetter = optionLabel.trim().substring(0, 1);
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: optionLetter
    });
  };

  // Text change handler for student-produced responses (grid-in)
  const handleGridInChange = (e) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: e.target.value
    });
  };

  // Navigation handlers
  const handleNext = () => {
    if (activeQuestionIndex < test.questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      // Last question: confirm submit
      if (confirm('Are you sure you want to submit your test?')) {
        onSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const isQuestionAnswered = (qId) => {
    return userAnswers[qId] !== undefined && userAnswers[qId] !== '';
  };

  const isMultipleChoice = currentQuestion.options && currentQuestion.options.length > 0;

  return (
    <div className="practice-container">
      {/* Test Practice Header */}
      <header className="practice-header">
        <div className="practice-title-section">
          <button className="back-to-dash-btn" onClick={onQuit}>
            ← Save & Quit
          </button>
          <h2>{test.title}</h2>
        </div>
        
        <div className={`practice-timer ${isTimeWarning ? 'warning' : ''}`}>
          <span>⏱</span>
          <span>{formatTime(remainingTime)}</span>
        </div>
      </header>

      {/* Test Workspace */}
      <div className="practice-workspace">
        {test.subject === 'verbal' ? (
          /* Split screen for Verbal (Reading & Writing) */
          <>
            <div className="split-pane left-pane">
              <div className="passage-text">{currentQuestion.passage}</div>
            </div>
            
            <div className="split-pane right-pane">
              <span className="question-number-badge">
                Question {activeQuestionIndex + 1} of {test.questions.length}
              </span>
              
              <div className="question-prompt">
                {currentQuestion.prompt}
              </div>
              
              <div className="options-list">
                {currentQuestion.options.map((opt, oIdx) => {
                  const letter = opt.trim().substring(0, 1);
                  const isSelected = userAnswers[currentQuestion.id] === letter;
                  
                  return (
                    <div 
                      key={oIdx}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      <div className="option-radio"></div>
                      <div className="option-label">{opt}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Single center panel for Math */
          <div className="single-pane">
            <span className="question-number-badge">
              Question {activeQuestionIndex + 1} of {test.questions.length}
            </span>
            
            <div className="question-prompt" style={{ whiteSpace: 'pre-line' }}>
              {currentQuestion.prompt}
            </div>

            {isMultipleChoice ? (
              /* Math Multiple Choice Options */
              <div className="options-list">
                {currentQuestion.options.map((opt, oIdx) => {
                  const letter = opt.trim().substring(0, 1);
                  const isSelected = userAnswers[currentQuestion.id] === letter;
                  
                  return (
                    <div 
                      key={oIdx}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      <div className="option-radio"></div>
                      <div className="option-label">{opt}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Math Grid-In (Student-Produced Response) Input Field */
              <div className="grid-in-container fade-in">
                <label className="grid-in-label" htmlFor="grid-input">
                  Your Answer
                </label>
                <input 
                  type="text"
                  id="grid-input"
                  className="grid-in-input"
                  placeholder="Type your numeric answer..."
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={handleGridInChange}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Controls */}
      <footer className="practice-footer">
        <button 
          className="nav-btn"
          onClick={handlePrev}
          disabled={activeQuestionIndex === 0}
        >
          Previous
        </button>

        <div className="question-bubbles-container">
          {test.questions.map((q, qIdx) => {
            const isCurrent = qIdx === activeQuestionIndex;
            const isAnswered = isQuestionAnswered(q.id);
            
            return (
              <div 
                key={q.id}
                className={`question-bubble ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                onClick={() => setActiveQuestionIndex(qIdx)}
              >
                {qIdx + 1}
              </div>
            );
          })}
        </div>

        <button 
          className={`nav-btn ${activeQuestionIndex === test.questions.length - 1 ? 'success' : 'primary'}`}
          onClick={handleNext}
        >
          {activeQuestionIndex === test.questions.length - 1 ? 'Submit Test' : 'Next'}
        </button>
      </footer>
    </div>
  );
}

export default TestPractice;
