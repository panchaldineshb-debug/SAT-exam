import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TestPractice from './components/TestPractice';
import ReviewMode from './components/ReviewMode';
import MarkdownDrill from './components/MarkdownDrill';
import LoginScreen from './components/LoginScreen';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'practice', 'review', 'drill'
  
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(1200); // 20 minutes in seconds
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [completedTests, setCompletedTests] = useState({});
  const [inProgressTests, setInProgressTests] = useState({});

  // Load test data, student history, and drills registry
  useEffect(() => {
    // Fetch scraped test questions
    const fetchTests = fetch('/tests_data.json').then(res => res.json());
    // Fetch markdown drills registry
    const fetchDrills = fetch('/data/drills_registry.json').then(res => res.ok ? res.json() : []).catch(() => []);
    
    Promise.all([fetchTests, fetchDrills])
      .then(([testsData, drillsData]) => {
        setTests(testsData);
        setDrills(drillsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, []); // Only load tests and drills once

  // Load progress when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    
    const savedCompleted = localStorage.getItem(`${currentUser}_sat_completed_tests`);
    if (savedCompleted) {
      setCompletedTests(JSON.parse(savedCompleted));
    } else {
      setCompletedTests({});
    }

    const savedInProgress = localStorage.getItem(`${currentUser}_sat_inprogress_tests`);
    if (savedInProgress) {
      setInProgressTests(JSON.parse(savedInProgress));
    } else {
      setInProgressTests({});
    }
  }, [currentUser]);

  // Save history to localStorage whenever it changes
  const saveCompletedToStorage = (newCompleted) => {
    setCompletedTests(newCompleted);
    if (currentUser) {
      localStorage.setItem(`${currentUser}_sat_completed_tests`, JSON.stringify(newCompleted));
    }
  };

  const saveInProgressToStorage = (newInProgress) => {
    setInProgressTests(newInProgress);
    if (currentUser) {
      localStorage.setItem(`${currentUser}_sat_inprogress_tests`, JSON.stringify(newInProgress));
    }
  };

  // Timer logic
  useEffect(() => {
    let timerInterval = null;
    if (currentView === 'practice' && selectedTest) {
      timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            // Auto submit when time runs out
            handleAutoSubmit();
            return 0;
          }
          // Save in progress time periodically
          const testKey = `${selectedTest.subject}_${selectedTest.id}`;
          const currentProgress = {
            answers: userAnswers,
            remainingTime: prevTime - 1,
            activeQuestionIndex: activeQuestionIndex
          };
          const updatedInProgress = { ...inProgressTests, [testKey]: currentProgress };
          saveInProgressToStorage(updatedInProgress);
          
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentView, selectedTest, userAnswers, activeQuestionIndex, inProgressTests]);

  const handleAutoSubmit = () => {
    alert('Time has expired! Your test will be submitted automatically.');
    handleSubmitTest();
  };

  // Action handlers
  const handleStartTest = (test) => {
    const testKey = `${test.subject}_${test.id}`;
    setSelectedTest(test);
    
    // Check if there's saved progress to resume
    if (inProgressTests[testKey]) {
      const saved = inProgressTests[testKey];
      setUserAnswers(saved.answers || {});
      setRemainingTime(saved.remainingTime || 1200);
      setActiveQuestionIndex(saved.activeQuestionIndex || 0);
    } else {
      // Start fresh
      setUserAnswers({});
      setRemainingTime(1200);
      setActiveQuestionIndex(0);
    }
    
    setCurrentView('practice');
  };

  const handleStartDrill = (drillPath) => {
    setSelectedDrill(drillPath);
    setCurrentView('drill');
  };

  const handleQuitTest = () => {
    if (!selectedTest) return;
    
    // Save current state in progress
    const testKey = `${selectedTest.subject}_${selectedTest.id}`;
    const currentProgress = {
      answers: userAnswers,
      remainingTime: remainingTime,
      activeQuestionIndex: activeQuestionIndex
    };
    
    const updatedInProgress = { ...inProgressTests, [testKey]: currentProgress };
    saveInProgressToStorage(updatedInProgress);
    
    // Reset test state and return to dashboard
    setCurrentView('dashboard');
    setSelectedTest(null);
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;
    
    // Calculate raw score
    let correctCount = 0;
    selectedTest.questions.forEach((q) => {
      const userAnswer = userAnswers[q.id];
      if (userAnswer) {
        // Normalize comparison (strip spaces, ignore case)
        const normUser = userAnswer.trim().toLowerCase().replace(/,/g, '');
        const normKey = q.key.trim().toLowerCase().replace(/,/g, '');
        if (normUser === normKey) {
          correctCount++;
        }
      }
    });

    const testKey = `${selectedTest.subject}_${selectedTest.id}`;
    
    // Save completed result
    const newResult = {
      score: correctCount,
      answers: userAnswers,
      totalQuestions: selectedTest.questions.length,
      date: new Date().toLocaleDateString()
    };
    
    const updatedCompleted = { ...completedTests, [testKey]: newResult };
    saveCompletedToStorage(updatedCompleted);

    // Remove from in-progress
    const updatedInProgress = { ...inProgressTests };
    delete updatedInProgress[testKey];
    saveInProgressToStorage(updatedInProgress);

    // Transition to review view
    setCurrentView('review');
  };

  const handleOpenReview = (test) => {
    setSelectedTest(test);
    const testKey = `${test.subject}_${test.id}`;
    // Load saved answers from completed history
    if (completedTests[testKey]) {
      setUserAnswers(completedTests[testKey].answers || {});
    }
    setCurrentView('review');
  };

  const handleReturnToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTest(null);
    setSelectedDrill(null);
    setUserAnswers({});
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#f4f4f5' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', marginBottom: '1rem' }}>Loading Practice Suite...</h2>
          <p style={{ color: '#a1a1aa' }}>Scraping results, setting up templates</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-badge">SP</div>
          <span className="logo-text">SAT Prep Suite</span>
        </div>
        <div className="user-badge" style={{ cursor: 'pointer' }} onClick={() => setCurrentUser(null)} title="Click to log out">
          <span className="user-indicator"></span>
          <span className="user-name">{currentUser}</span>
        </div>
      </header>
      
      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard 
            tests={tests}
            drills={drills}
            completedTests={completedTests}
            inProgressTests={inProgressTests}
            onStartTest={handleStartTest}
            onOpenReview={handleOpenReview}
            onStartDrill={handleStartDrill}
          />
        )}
        
        {currentView === 'practice' && selectedTest && (
          <TestPractice 
            test={selectedTest}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            remainingTime={remainingTime}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            onQuit={handleQuitTest}
            onSubmit={handleSubmitTest}
          />
        )}
        
        {currentView === 'review' && selectedTest && (
          <ReviewMode 
            test={selectedTest}
            completedInfo={completedTests[`${selectedTest.subject}_${selectedTest.id}`]}
            onBack={handleReturnToDashboard}
          />
        )}
        
        {currentView === 'drill' && selectedDrill && (
          <MarkdownDrill
            drillPath={selectedDrill}
            onBack={handleReturnToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;
