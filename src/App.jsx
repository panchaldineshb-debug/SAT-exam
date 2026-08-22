import React, { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import Dashboard from './components/Dashboard';
import TestPractice from './components/TestPractice';
import ReviewMode from './components/ReviewMode';
import MarkdownDrill from './components/MarkdownDrill';
import LoginScreen from './components/LoginScreen';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [drills, setDrills] = useState([]);
  const [ratings, setRatings] = useState({});
  const [globalScores, setGlobalScores] = useState([]);
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
    const initApp = async () => {
      let isAuth = false;
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username || user.signInDetails?.loginId || "Student");
        isAuth = true;
      } catch (err) {
        setCurrentUser(null);
        setLoading(false); // If not logged in, stop loading immediately to show LoginScreen
      }
      
      const fetchPublicData = async () => {
        try {
          const testsData = await fetch('/tests_data.json').then(res => res.json());
          const drillsData = await fetch('/data/drills_registry.json').then(res => res.ok ? res.json() : []).catch(() => []);
          const scoresData = await fetch('/data/scores_distribution.json').then(res => res.ok ? res.json() : []).catch(() => []);
          setTests(testsData);
          setDrills(drillsData);
          setGlobalScores(scoresData);
        } catch (err) {
          console.error('Error loading static data:', err);
        }
      };

      const fetchDashboard = async () => {
        try {
          const session = await fetchAuthSession();
          if (!session || !session.tokens || !session.tokens.idToken) return;
          const token = session.tokens.idToken.toString();
          
          const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          
          try {
            const ratingsRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/ratings`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ratingsRes.ok) setRatings(await ratingsRes.json());
          } catch (err) {
            console.error("Error fetching ratings:", err);
          }
          
          const comp = {};
          const inProg = {};
          
          if (data.progress) {
             data.progress.forEach(p => {
               const testKey = p.testId;
               if (p.status === "COMPLETED") {
                 comp[testKey] = {
                   score: p.score,
                   totalQuestions: p.totalQuestions,
                   answers: p.answers,
                   date: p.date,
                   gradedAnswers: p.gradedAnswers
                 };
               } else {
                 inProg[testKey] = {
                   answers: p.answers || {},
                   remainingTime: p.remainingTime || 1200,
                   activeQuestionIndex: p.activeQuestionIndex || 0
                 };
               }
             });
          }
          setCompletedTests(comp);
          setInProgressTests(inProg);
        } catch (err) {
          console.error('Error fetching dashboard from cloud:', err);
        }
      };

      // Only fetch dashboard if authenticated. We can fetch public data anytime.
      const tasks = [fetchPublicData()];
      if (isAuth) {
        tasks.push(fetchDashboard());
      }
      
      await Promise.all(tasks);
      setLoading(false);
    };

    initApp();
  }, []);

  const saveInProgressLocally = (newInProgress) => {
    setInProgressTests(newInProgress);
    localStorage.setItem(`${currentUser}_in_prog`, JSON.stringify(newInProgress));
  };

  useEffect(() => {
    const local = localStorage.getItem(`${currentUser}_in_prog`);
    if (local) {
      setInProgressTests(JSON.parse(local));
    }
  }, [currentUser]);

  // Timer logic
  useEffect(() => {
    let timerInterval = null;
    if (currentView === 'practice' && selectedTest) {
      timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleAutoSubmit();
            return 0;
          }
          const testKey = selectedTest.id;
          const currentProgress = {
            answers: userAnswers,
            remainingTime: prevTime - 1,
            activeQuestionIndex: activeQuestionIndex
          };
          const updatedInProgress = { ...inProgressTests, [testKey]: currentProgress };
          saveInProgressLocally(updatedInProgress);
          
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

  const handleStartTest = (test) => {
    const testKey = test.id;
    setSelectedTest(test);
    
    if (inProgressTests[testKey]) {
      const saved = inProgressTests[testKey];
      setUserAnswers(saved.answers || {});
      setRemainingTime(saved.remainingTime || 1200);
      setActiveQuestionIndex(saved.activeQuestionIndex || 0);
    } else {
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
    
    const testKey = selectedTest.id;
    const currentProgress = {
      answers: userAnswers,
      remainingTime: remainingTime,
      activeQuestionIndex: activeQuestionIndex
    };
    
    const updatedInProgress = { ...inProgressTests, [testKey]: currentProgress };
    saveInProgressLocally(updatedInProgress);
    
    setCurrentView('dashboard');
    setSelectedTest(null);
  };

  const handleSubmitTest = async () => {
    if (!selectedTest) return;
    
    const testKey = selectedTest.id;
    
    try {
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: testKey,
          answers: userAnswers
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const newResult = {
          score: data.score,
          answers: userAnswers,
          totalQuestions: data.totalQuestions,
          date: new Date().toLocaleDateString(),
          gradedAnswers: data.gradedAnswers
        };
        
        setCompletedTests(prev => ({ ...prev, [testKey]: newResult }));
        
        const updatedInProgress = { ...inProgressTests };
        delete updatedInProgress[testKey];
        saveInProgressLocally(updatedInProgress);

        setCurrentView('review');
      } else {
        alert("Failed to submit test: " + data.message);
      }
    } catch(err) {
      console.error(err);
      alert("Error submitting test to the cloud.");
    }
  };

  const handleOpenReview = (test) => {
    setSelectedTest(test);
    const testKey = test.id;
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

  const handleCancelTest = () => {
    if (!selectedTest) return;
    
    if (confirm('Are you sure you want to cancel this test? All unsaved progress will be lost.')) {
      const testKey = selectedTest.id;
      const updatedInProgress = { ...inProgressTests };
      if (updatedInProgress[testKey]) {
        delete updatedInProgress[testKey];
        saveInProgressLocally(updatedInProgress);
      }
      
      setCurrentView('dashboard');
      setSelectedTest(null);
      setUserAnswers({});
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      window.location.reload();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleLogoClick = () => {
    if (currentView === 'practice') {
      if (confirm('Return to dashboard? Your current progress will be auto-saved.')) {
        handleQuitTest();
      }
    } else {
      handleReturnToDashboard();
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#f4f4f5' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', marginBottom: '1rem' }}>Loading Practice Suite...</h2>
          <p style={{ color: '#a1a1aa' }}>Syncing data from SarabiLabs Cloud...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
          <div className="logo-badge">SP</div>
          <span className="logo-text">SAT Prep Suite</span>
        </div>
        <div className="user-badge" style={{ cursor: 'pointer' }} onClick={handleSignOut} title="Click to log out">
          <span className="user-indicator"></span>
          <span className="user-name">{currentUser} | Sign Out</span>
        </div>
      </header>
      
      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard 
            tests={tests}
            drills={drills}
            ratings={ratings}
            completedTests={completedTests}
            inProgressTests={inProgressTests}
            globalScores={globalScores}
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
            onCancel={handleCancelTest}
            onSubmit={handleSubmitTest}
          />
        )}
        
        {currentView === 'review' && selectedTest && (
          <ReviewMode 
            test={selectedTest}
            completedInfo={completedTests[selectedTest.id]}
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
