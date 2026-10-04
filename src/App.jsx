import React, { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import Dashboard from './components/Dashboard';
import TestPractice from './components/TestPractice';
import ReviewMode from './components/ReviewMode';
import MarkdownDrill from './components/MarkdownDrill';
import LoginScreen from './components/LoginScreen';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import AboutUs from './components/AboutUs';
import CookieNotice from './components/CookieNotice';
import Features from './components/Features';
import Security from './components/Security';
import TrustCenter from './components/TrustCenter';
import StudentSupport from './components/StudentSupport';
import ParentGuide from './components/ParentGuide';
import DataRights from './components/DataRights';
import ContactSafety from './components/ContactSafety';
import Footer from './components/Footer';

const resolveViewFromLocation = () => {
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const viewParam = (searchParams.get('view') || '').toLowerCase();
  const target = path || viewParam;

  const validPublicViews = [
    'trust', 'privacy', 'terms', 'student-support', 'parent-guide',
    'data-rights', 'contact', 'about', 'features', 'security'
  ];

  if (validPublicViews.includes(target)) {
    return target;
  }
  return 'dashboard';
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [drills, setDrills] = useState([]);
  const [ratings, setRatings] = useState({});
  const [globalPercentile, setGlobalPercentile] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(resolveViewFromLocation);
  
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(1200); // 20 minutes in seconds
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [completedTests, setCompletedTests] = useState({});
  const [inProgressTests, setInProgressTests] = useState({});

  const navigateTo = (view, path) => {
    setCurrentView(view);
    const targetPath = path || (view === 'dashboard' ? '/' : `/${view}`);
    window.history.pushState({ view }, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(resolveViewFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
          const testsData = await fetch('/tests_data.json?v=' + new Date().getTime()).then(res => res.json());
          const drillsData = await fetch('/data/drills_registry.json').then(res => res.ok ? res.json() : []).catch(() => []);
          setTests(testsData);
          setDrills(drillsData);
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
                   scaledScore: p.scaledScore || p.score,
                   totalQuestions: p.totalQuestions,
                   answers: p.answers,
                   date: p.completedAt || p.date,
                   gradedAnswers: p.gradedAnswers,
                   aiAdvice: p.aiAdvice
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
          if (data.percentile) {
            setGlobalPercentile(data.percentile + "th");
          }
        } catch (err) {
          console.error('Error fetching dashboard from cloud:', err);
        }
      };

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
    
    navigateTo('dashboard', '/');
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
    navigateTo('dashboard', '/');
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
      
      navigateTo('dashboard', '/');
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

  // Unauthenticated routing: public informational pages + login screen
  if (!currentUser) {
    let publicContent = null;
    if (currentView === 'trust') {
      publicContent = <TrustCenter onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'student-support') {
      publicContent = <StudentSupport onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'parent-guide') {
      publicContent = <ParentGuide onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'data-rights') {
      publicContent = <DataRights onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'contact') {
      publicContent = <ContactSafety onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'privacy') {
      publicContent = <PrivacyPolicy onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'terms') {
      publicContent = <TermsOfUse onNavigate={navigateTo} onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'about') {
      publicContent = <AboutUs onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'features') {
      publicContent = <Features onBack={() => navigateTo('dashboard', '/')} />;
    } else if (currentView === 'security') {
      publicContent = <Security onBack={() => navigateTo('dashboard', '/')} />;
    } else {
      publicContent = <LoginScreen onLoginSuccess={() => window.location.reload()} onNavigate={navigateTo} />;
    }

    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="app-header">
          <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => navigateTo('dashboard', '/')}>
            <div className="logo-badge">SP</div>
            <span className="logo-text">SAT Prep Suite</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => navigateTo('trust', '/trust')}
              className="nav-btn"
              style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              🛡️ Trust Center
            </button>
            <button 
              onClick={() => navigateTo('dashboard', '/')}
              className="nav-btn primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              Sign In
            </button>
          </div>
        </header>

        <main className="main-content" style={{ flex: 1 }}>
          {publicContent}
        </main>

        <Footer onNavigate={navigateTo} />
        <CookieNotice />
      </div>
    );
  }

  // Authenticated routing
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="app-header">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
          <div className="logo-badge">SP</div>
          <span className="logo-text">SAT Prep Suite</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigateTo('trust', '/trust')}
            className="nav-btn"
            style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#d4d4d8', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            🛡️ Trust Center
          </button>
          <div className="user-badge" style={{ cursor: 'pointer' }} onClick={handleSignOut} title="Click to log out">
            <span className="user-indicator"></span>
            <span className="user-name">{currentUser} | Sign Out</span>
          </div>
        </div>
      </header>
      
      <main className="main-content" style={{ flex: 1 }}>
        {currentView === 'dashboard' && (
          <Dashboard 
            tests={tests}
            drills={drills}
            ratings={ratings}
            completedTests={completedTests}
            inProgressTests={inProgressTests}
            globalPercentile={globalPercentile}
            onStartTest={handleStartTest}
            onOpenReview={handleOpenReview}
            onStartDrill={handleStartDrill}
            onNavigate={navigateTo}
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
            onNavigate={navigateTo}
          />
        )}
        
        {currentView === 'drill' && selectedDrill && (
          <MarkdownDrill
            drillPath={selectedDrill}
            onBack={handleReturnToDashboard}
          />
        )}

        {currentView === 'trust' && (
          <TrustCenter onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'student-support' && (
          <StudentSupport onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'parent-guide' && (
          <ParentGuide onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'data-rights' && (
          <DataRights onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'contact' && (
          <ContactSafety onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'terms' && (
          <TermsOfUse onNavigate={navigateTo} onBack={handleReturnToDashboard} />
        )}

        {currentView === 'about' && (
          <AboutUs onBack={handleReturnToDashboard} />
        )}

        {currentView === 'features' && (
          <Features onBack={handleReturnToDashboard} />
        )}

        {currentView === 'security' && (
          <Security onBack={handleReturnToDashboard} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
      <CookieNotice />
    </div>
  );
}

export default App;
