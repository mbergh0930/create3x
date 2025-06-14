// src/pages/PreSessionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import GameWheel from '../components/session/GameWheel';

const PreSessionFlow = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { createSession } = useSession();
  const [step, setStep] = useState('ready'); // 'ready', 'rounds', 'mode', 'loading'
  const [selectedRounds, setSelectedRounds] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  // Get mode from URL params if provided
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode) {
      setSelectedMode(mode);
    }
  }, [searchParams]);

  // Number options for the wheel (3-7 rounds)
  const roundOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 3,
    display: `${i + 3} Round${i === 0 ? 's' : 's'}`
  }));

  const handleReadyClick = () => {
    setStep('rounds');
  };

  const handleRoundsResult = (result) => {
    setSelectedRounds(result.value);
    setTimeout(() => {
      setStep('mode');
    }, 2000); // Show result for 2 seconds
  };

  const handleModeSelection = async (mode) => {
    if (!selectedRounds) return;

    try {
      setIsCreating(true);
      console.log('Creating real session...', { mode, rounds: selectedRounds });
      
      // Create real session with SessionContext
      const config = {};
      if (mode === 'master-artist') {
        config.artistId = 'van-gogh';
        config.artistFocus = 'all';
      }
      
      const session = await createSession(mode, config, selectedRounds);
      console.log('Session created successfully:', session);
      
      // Navigate to session flow
      window.location.href = '/session';
      
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error creating session: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    if (step === 'mode') {
      setStep('rounds');
      setSelectedRounds(null);
    } else if (step === 'rounds') {
      setStep('ready');
    } else {
      window.location.href = '/dashboard';
    }
  };

  if (!user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '600'
            }}>
              create3x
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {step === 'ready' ? 'Start your creative journey' :
               step === 'rounds' ? 'Discover your session length' : 
               step === 'mode' ? 'Choose your creative path' : 'Setting up...'} • Step {
                 step === 'ready' ? '1' : step === 'rounds' ? '2' : step === 'mode' ? '3' : '...'
               } of 3
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handleBack}
              style={{
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
              disabled={isCreating}
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        
        {/* Step 1: Ready to Create */}
        {step === 'ready' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '3rem',
              color: '#111827',
              marginBottom: '3rem',
              fontWeight: '600'
            }}>
              Ready to Create?
            </h2>
            
            <p style={{ 
              fontSize: '1.2rem',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto 4rem auto',
              textAlign: 'left'
            }}>
              You're about to embark on a creative journey guided by randomization. 
              Let go of overthinking and embrace the unexpected combinations that await you.
            </p>

            <button 
              onClick={handleReadyClick}
              style={{
                fontSize: '1.5rem',
                padding: '1.5rem 3rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                animation: 'pulse 2s infinite'
              }}
            >
              Yes! ✨
            </button>
          </div>
        )}

        {/* Step 2: Select Number of Rounds */}
        {step === 'rounds' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.2rem',
                color: '#111827',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                How Many Creative Rounds?
              </h2>
              <p style={{ 
                fontSize: '1.1rem',
                color: '#6b7280',
                maxWidth: '400px',
                margin: '0 auto',
                textAlign: 'left'
              }}>
                Click to spin and discover how many creative turns your session will have. 
                Each turn brings new elements to explore.
              </p>
            </div>

            <GameWheel
              size={350}
              options={roundOptions}
              onResult={handleRoundsResult}
              title=""
              subtitle="Click to spin for your session length!"
              centerIcon="🎨"
            />
          </div>
        )}

        {/* Step 3: Select Mode */}
        {step === 'mode' && (
          <div>
            {/* Rounds Confirmation */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '2px solid #2563eb',
                display: 'inline-block'
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem',
                  color: '#2563eb',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  🎲 {selectedRounds} Creative Round{selectedRounds !== 1 ? 's' : ''}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Perfect! Now choose your creative path.
                </p>
              </div>
            </div>

            {/* Mode Selection */}
            <div>
              <h2 style={{ 
                fontSize: '2rem',
                color: '#111827',
                marginBottom: '2rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Choose Your Creative Path
              </h2>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {/* Just Play Mode */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  padding: '2rem'
                }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', 
                    borderRadius: '50%',
                    margin: '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>
                    🎨
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Just Play
                  </h3>
                  
                  <p style={{ 
                    color: '#6b7280',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}>
                    Pure creative flow. Spin for elements and create without any pressure or documentation.
                  </p>
                  
                  <button 
                    onClick={() => handleModeSelection('play')}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating Session...' : 'Choose Just Play'}
                  </button>
                </div>

                {/* Play & Journal Mode */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  padding: '2rem'
                }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #8b5cf6, #dc2626)', 
                    borderRadius: '50%',
                    margin: '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>
                    📝
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Play & Journal
                  </h3>
                  
                  <p style={{ 
                    color: '#6b7280',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}>
                    Reflect on each step and track your creative growth with optional journaling.
                  </p>
                  
                  <button 
                    onClick={() => handleModeSelection('play-and-journal')}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating Session...' : 'Choose Play & Journal'}
                  </button>
                </div>

                {/* Study Masters Mode */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  padding: '2rem'
                }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)', 
                    borderRadius: '50%',
                    margin: '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>
                    🎭
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Study Masters
                  </h3>
                  
                  <p style={{ 
                    color: '#6b7280',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}>
                    Learn from legendary artists by exploring their signature palettes and techniques.
                  </p>
                  
                  <button 
                    onClick={() => handleModeSelection('master-artist')}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      background: '#f59e0b',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating Session...' : 'Choose Study Masters'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '4rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: step === 'ready' ? '#2563eb' : 
                       (step === 'rounds' || step === 'mode') ? '#10b981' : '#d1d5db',
            transition: 'background 0.3s ease'
          }} />
          <div style={{
            width: '30px',
            height: '2px',
            background: step === 'mode' ? '#10b981' : '#d1d5db',
            transition: 'background 0.3s ease'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: step === 'rounds' ? '#2563eb' : 
                       step === 'mode' ? '#10b981' : '#d1d5db',
            transition: 'background 0.3s ease'
          }} />
          <div style={{
            width: '30px',
            height: '2px',
            background: step === 'mode' ? '#2563eb' : '#d1d5db',
            transition: 'background 0.3s ease'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: step === 'mode' ? '#2563eb' : '#d1d5db',
            transition: 'background 0.3s ease'
          }} />
        </div>
      </main>

      {/* Add pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default PreSessionFlow;