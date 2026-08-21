import React, { useState } from 'react';

function Dashboard({ tests, drills, completedTests, inProgressTests, onStartTest, onOpenReview, onStartDrill }) {
  const [activeTab, setActiveTab] = useState('verbal'); // 'verbal', 'math', 'drills'

  // Calculate statistics
  const completedKeys = Object.keys(completedTests);
  const totalCompleted = completedKeys.length;
  
  const verbalTests = tests.filter((t) => t.subject === 'verbal');
  const mathTests = tests.filter((t) => t.subject === 'math');
  
  const completedVerbal = completedKeys.filter((k) => k.startsWith('verbal')).length;
  const completedMath = completedKeys.filter((k) => k.startsWith('math')).length;

  const totalScore = completedKeys.reduce((acc, key) => acc + (completedTests[key]?.score || 0), 0);
  const averageScore = totalCompleted > 0 ? (totalScore / totalCompleted).toFixed(1) : 'N/A';

  const inProgressKeys = Object.keys(inProgressTests);
  const totalInProgress = inProgressKeys.length;

  // Filter tests for the active tab
  const displayTests = activeTab === 'verbal' ? verbalTests : mathTests;

  // Progress percentage
  const totalTestsCount = tests.length || 1;
  const overallProgressPercent = Math.round((totalCompleted / totalTestsCount) * 100);
  const verbalProgressPercent = verbalTests.length > 0 ? Math.round((completedVerbal / verbalTests.length) * 100) : 0;
  const mathProgressPercent = mathTests.length > 0 ? Math.round((completedMath / mathTests.length) * 100) : 0;

  return (
    <div className="dashboard-grid">
      {/* Sidebar with Stats */}
      <aside className="stats-sidebar">
        <div className="stats-card">
          <h3 className="stats-header">Sameer's Progress</h3>
          <div className="stat-item">
            <span className="stat-label">Total Tests Completed</span>
            <span className="stat-value highlight">{totalCompleted} / {tests.length}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${overallProgressPercent}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            <span>{overallProgressPercent}% Complete</span>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="stats-header">Performance Metrics</h3>
          <div className="stat-item">
            <span className="stat-label">Average Score</span>
            <span className="stat-value" style={{ color: totalCompleted > 0 && averageScore >= 8 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
              {averageScore} {totalCompleted > 0 && '/ 10'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active (In-Progress)</span>
            <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>{totalInProgress}</span>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="stats-header">Subject Breakdown</h3>
          <div className="stat-item">
            <span className="stat-label">Reading & Writing</span>
            <span className="stat-value">{completedVerbal} / {verbalTests.length}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${verbalProgressPercent}%` }}></div>
          </div>
          
          <div className="stat-item" style={{ marginTop: '1rem' }}>
            <span className="stat-label">Math</span>
            <span className="stat-value">{completedMath} / {mathTests.length}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${mathProgressPercent}%` }}></div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <section className="main-panel">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'verbal' ? 'active' : ''}`}
            onClick={() => setActiveTab('verbal')}
          >
            Reading & Writing ({verbalTests.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            Math ({mathTests.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'drills' ? 'active' : ''}`}
            onClick={() => setActiveTab('drills')}
          >
            Drills ({drills.length})
          </button>
        </div>

        {activeTab === 'drills' ? (
          <div className="test-cards-grid">
            {drills.map((drill) => (
              <div 
                key={drill.id} 
                className="test-card"
                onClick={() => onStartDrill(drill.path)}
              >
                <div className="test-card-header">
                  <span className="logo-badge" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem' }}>
                    DR
                  </span>
                  <span className="test-badge not-started">Markdown</span>
                </div>
                <div className="test-card-title">
                  {drill.title}
                </div>
                <div className="test-card-footer">
                  <div className="test-meta-info">
                    <span>{drill.date}</span>
                  </div>
                  <div style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600 }}>
                    Start Drill →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="test-cards-grid">
            {displayTests.map((test) => {
              const testKey = `${test.subject}_${test.id}`;
            const isCompleted = !!completedTests[testKey];
            const isInProgress = !!inProgressTests[testKey];
            const score = isCompleted ? completedTests[testKey].score : null;

            return (
              <div 
                key={testKey} 
                className={`test-card ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}
                onClick={() => isCompleted ? onOpenReview(test) : onStartTest(test)}
              >
                <div className="test-card-header">
                  <span className="logo-badge" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem' }}>
                    {test.subject === 'verbal' ? 'RW' : 'M'}
                  </span>
                  
                  {isCompleted && (
                    <span className="test-badge completed">Completed</span>
                  )}
                  {isInProgress && (
                    <span className="test-badge in-progress">In Progress</span>
                  )}
                  {!isCompleted && !isInProgress && (
                    <span className="test-badge not-started">Not Started</span>
                  )}
                </div>

                <div className="test-card-title">
                  {test.title}
                </div>

                <div className="test-card-footer">
                  <div className="test-meta-info">
                    <span>10 Questions</span>
                    <span>•</span>
                    <span>20 Mins</span>
                  </div>

                  {isCompleted && (
                    <div className="test-score-display">
                      Score: {score} / 10
                    </div>
                  )}
                  {isInProgress && (
                    <div style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Resume →
                    </div>
                  )}
                  {!isCompleted && !isInProgress && (
                    <div style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Start Practice →
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
