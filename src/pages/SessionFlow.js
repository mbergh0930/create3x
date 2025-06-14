// src/pages/SessionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import SpinningWheel from '../components/session/SpinningWheel';

const SessionFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentSession, 
    isSpinning, 
    setIsSpinning,
    generateTurn,
    completeTurn,
    endSession,
    getContentDisplay
  } = useSession();

  const [currentTurn, setCurrentTurn] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no session
  useEffect(() => {
    if (!currentSession) {
      navigate('/dashboard');
    }
  }, [currentSession, navigate]);

  // Start the first turn when component loads
  useEffect(() => {
    if (currentSession && !currentTurn && !isSpinning) {
      handleStartTurn();
    }
  }, [currentSession, currentTurn, isSpinning]);

  const handleStartTurn = async () => {
    if (!currentSession) return;

    try {
      setIsLoading(true);
      const turnData = await generateTurn(currentSession.id, currentSession.currentTurn);
      
      // Add display data
      const turnWithDisplay = {
        ...turnData,
        colorDisplay: getContentDisplay('colors', turnData.color),
        techniqueDisplay: getContentDisplay('techniques', turnData.technique),
        mediumDisplay: getContentDisplay('mediums', turnData.medium),
        totalTurns: currentSession.plannedTurns
      };

      setCurrentTurn(turnWithDisplay);
      setIsSpinning(true);
    } catch (error) {
      console.error('Error starting turn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    
    // Show reflection prompt for journaling mode
    if (currentSession.mode === 'play-and-journal') {
      setTimeout(() => {
        setShowReflection(true);
      }, 1000);
    }
  };

  const handleContinue = async () => {
    if (!currentTurn) return;

    try {
      setIsLoading(true);
      
      // Complete current turn
      await completeTurn(currentTurn, reflection);
      
      // Check if session is complete
      if (currentSession.currentTurn >= currentSession.plannedTurns) {
        // Session complete - show final reflection or end
        handleSessionComplete();
      } else {
        // Start next turn
        setCurrentTurn(null);
        setReflection('');
        setShowReflection(false);
        handleStartTurn();
      }
    } catch (error) {
      console.error('Error continuing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndEarly = async () => {
    try {
      setIsLoading(true);
      await endSession(true, reflection);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending session early:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionComplete = async () => {
    try {
      setIsLoading(true);
      await endSession(false, reflection);
      navigate('/dashboard'); // TODO: Navigate to completion page
    } catch (error) {
      console.error('Error completing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipReflection = () => {
    setReflection('');
    setShowReflection(false);
    handleContinue();
  };

  if (!currentSession) {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--white)', 
        borderBottom: '1px solid var(--gray-200)',
        padding: 'var(--space-md) 0'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)'
        }}>
          <div>
            <h1 className="text-display" style={{ 
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              create3x
            </h1>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              {currentSession.mode === 'play' ? 'Just Play' :
               currentSession.mode === 'play-and-journal' ? 'Play & Journal' :
               'Study Masters'} Mode
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Turn {currentSession.currentTurn} of {currentSession.plannedTurns}
            </span>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Exit Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Loading State */}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}>
            <div className="text-center">
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--gray-200)',
                borderTop: '4px solid var(--primary-blue)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: 'var(--space-md)'
              }}></div>
              <p style={{ color: 'var(--gray-600)' }}>
                Preparing your creative elements...
              </p>
            </div>
          </div>
        )}

        {/* Spinning Wheel */}
        {!isLoading && currentTurn && (
          <SpinningWheel
            isSpinning={isSpinning}
            result={currentTurn}
            onSpinComplete={handleSpinComplete}
          />
        )}

        {/* Reflection Section */}
        {showReflection && !isSpinning && currentTurn && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: 'var(--space-lg)'
          }}>
            <div className="card card-padding">
              <h3 className="text-display text-center mb-md" style={{ fontSize: '1.3rem' }}>
                Take a Moment to Reflect
              </h3>
              
              <p className="text-center mb-lg" style={{ color: 'var(--gray-600)' }}>
                What comes to mind with these elements? How do they make you feel?
              </p>

              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Share your thoughts, feelings, or ideas... (optional)"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: 'var(--space-sm)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  resize: 'vertical',
                  marginBottom: 'var(--space-lg)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
              />

              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-sm)', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={handleSkipReflection}
                  className="btn btn-secondary"
                >
                  Skip Reflection
                </button>
                <button 
                  onClick={handleContinue}
                  className="btn btn-primary"
                >
                  {reflection ? 'Save & Continue' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showReflection && !isSpinning && currentTurn && !isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            padding: 'var(--space-lg)',
            flexWrap: 'wrap'
          }}>
            {currentSession.currentTurn < currentSession.plannedTurns && (
              <button 
                onClick={handleEndEarly}
                className="btn btn-secondary"
              >
                End Session Now
              </button>
            )}
            
            <button 
              onClick={handleContinue}
              className="btn btn-primary"
              style={{ fontSize: '1.1rem', padding: 'var(--space-md) var(--space-lg)' }}
            >
              {currentSession.currentTurn >= currentSession.plannedTurns 
                ? 'Complete Session' 
                : 'Next Turn'}
            </button>
          </div>
        )}

        {/* Session Progress */}
        {currentTurn && (
          <div style={{
            maxWidth: '400px',
            margin: '0 auto var(--space-lg) auto',
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-xs)'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                Session Progress
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                {currentSession.completedTurns} / {currentSession.plannedTurns}
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--gray-200)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentSession.completedTurns / currentSession.plannedTurns) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-blue), var(--accent-purple))',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </main>

      {/* Add spinning animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SessionFlow;