// src/pages/SessionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import SlotMachine from '../components/session/SlotMachine';

const SessionFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentSession, 
    generateTurn,
    completeTurn,
    endSession,
    getContentDisplay
  } = useSession();

  const [currentTurn, setCurrentTurn] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [finalJournal, setFinalJournal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slotMachineKey, setSlotMachineKey] = useState(0);
  const [showPastEntries, setShowPastEntries] = useState(false);
  const [isSpinComplete, setIsSpinComplete] = useState(false);
  const [showFinalJournal, setShowFinalJournal] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [shareSettings, setShareSettings] = useState({
    shareJournal: false,
    shareName: false
  });

  // Auto-save journal entry with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-save logic here - could save to localStorage or Firebase
      if (journalEntry) {
        console.log('Auto-saving journal entry:', journalEntry);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [journalEntry]);

  // Auto-save final journal with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (finalJournal) {
        console.log('Auto-saving final journal:', finalJournal);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [finalJournal]);

  // Redirect if no session
  useEffect(() => {
    if (!currentSession) {
      navigate('/dashboard');
    }
  }, [currentSession, navigate]);

  // Start the first turn when component loads
  useEffect(() => {
    if (currentSession && !currentTurn && !isLoading) {
      handleStartTurn();
    }
  }, [currentSession, currentTurn, isLoading]);

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
      setSlotMachineKey(prev => prev + 1); // Force re-render of slot machine
      setIsSpinComplete(false);
      setShowJournal(false);
      setJournalEntry('');
    } catch (error) {
      console.error('Error starting turn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = () => {
    setIsSpinComplete(true);
    // Show journal automatically for journaling modes
    if (currentSession.mode === 'play-and-journal') {
      setTimeout(() => {
        setShowJournal(true);
      }, 1000);
    }
  };

  const handleNextRound = async () => {
    if (!currentTurn) return;

    try {
      setIsLoading(true);
      
      // Complete current turn
      await completeTurn(currentTurn, journalEntry);
      
      // Check if this was the last round
      if (currentSession.currentTurn >= currentSession.plannedTurns) {
        // Show final journal or complete session
        setShowFinalJournal(true);
      } else {
        // Start next round
        setCurrentTurn(null);
        setJournalEntry('');
        setShowJournal(false);
        handleStartTurn();
      }
    } catch (error) {
      console.error('Error continuing to next round:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    try {
      setIsLoading(true);
      
      // Complete current turn if exists
      if (currentTurn && journalEntry) {
        await completeTurn(currentTurn, journalEntry);
      }
      
      await endSession(true, finalJournal);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      setIsLoading(true);
      
      // Complete final turn if needed
      if (currentTurn && journalEntry) {
        await completeTurn(currentTurn, journalEntry);
      }
      
      await endSession(false, finalJournal);
      setShowSessionComplete(true);
    } catch (error) {
      console.error('Error completing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically upload to Firebase Storage
      // For now, just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleFinishAndSave = async () => {
    // Save final session data with image and share settings
    // This would update Firebase with the complete session
    console.log('Saving final session:', {
      image: uploadedImage,
      shareSettings,
      finalJournal
    });
    
    navigate('/dashboard');
  };

  if (!currentSession) {
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
              {currentSession.mode === 'inspire' ? 'Inspire Me' :
               currentSession.mode === 'masters' ? 'Explore the Masters' :
               currentSession.mode === 'play' ? 'Just Play' :
               currentSession.mode === 'play-and-journal' ? 'Play & Journal' :
               'Study Masters'} Mode
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Round {currentSession.currentTurn} of {currentSession.plannedTurns}
            </span>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Exit Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Session Complete View */}
        {showSessionComplete && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                textAlign: 'center', 
                marginBottom: '2rem',
                color: '#111827'
              }}>
                🎉 Session Complete!
              </h2>

              {/* Session Summary */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Your Creative Journey:</h3>
                {currentSession.turns.map((turn, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      Round {turn.turnNumber}
                    </h4>
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Color:</strong> {getContentDisplay('colors', turn.color)?.name || turn.color}
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Technique:</strong> {getContentDisplay('techniques', turn.technique)?.name || turn.technique}
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Medium:</strong> {getContentDisplay('mediums', turn.medium)?.name || turn.medium}
                    </p>
                    {turn.reflection && (
                      <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#6b7280' }}>
                        "{turn.reflection}"
                      </p>
                    )}
                  </div>
                ))}
                
                {finalJournal && (
                  <div style={{
                    border: '2px solid #2563eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#2563eb' }}>
                      Final Thoughts
                    </h4>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>
                      "{finalJournal}"
                    </p>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Share Your Artwork</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Upload a photo of your creation to share in the gallery with your prompts.
                </p>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
                
                {uploadedImage && (
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded artwork"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Sharing Options */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Gallery Sharing Options</h3>
                
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={shareSettings.shareJournal}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, shareJournal: e.target.checked }))}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Share my journal entries publicly
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={shareSettings.shareName}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, shareName: e.target.checked }))}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Share my name publicly
                </label>
                
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Your prompts will always be shared. Journal entries and name are hidden by default.
                </p>
              </div>

              {/* Finish Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleFinishAndSave}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  Save & Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Journal View */}
        {showFinalJournal && !showSessionComplete && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                textAlign: 'center', 
                marginBottom: '1rem' 
              }}>
                🎊 All Rounds Complete!
              </h2>
              
              <p style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                marginBottom: '2rem' 
              }}>
                Take a moment to reflect on your entire creative session.
              </p>

              <textarea
                value={finalJournal}
                onChange={(e) => setFinalJournal(e.target.value.slice(0, 300))}
                placeholder="Share any final thoughts on your session"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '0.5rem'
                }}
              />
              
              <div style={{ 
                textAlign: 'right', 
                fontSize: '0.9rem', 
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                {finalJournal.length}/300 characters
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center' 
              }}>
                <button
                  onClick={handleCompleteSession}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {finalJournal ? 'Save & Complete' : 'Complete Session'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Session View */}
        {!showFinalJournal && !showSessionComplete && (
          <>
            {/* Loading State */}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1rem'
                  }}></div>
                  <p style={{ color: '#6b7280' }}>
                    Preparing your creative elements...
                  </p>
                </div>
              </div>
            )}

            {/* Slot Machine */}
            {!isLoading && currentTurn && (
              <SlotMachine
                key={slotMachineKey}
                isSpinning={false}
                result={currentTurn}
                onSpinComplete={handleSpinComplete}
                mode={currentSession.mode}
              />
            )}

            {/* Journal Section */}
            {isSpinComplete && (
              <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    Journal Entry
                  </h3>
                  
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value.slice(0, 300))}
                    placeholder="Share your thoughts on this round"
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      marginBottom: '0.5rem'
                    }}
                  />
                  
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    <span>Auto-Saving...</span>
                    <span>{journalEntry.length}/300 characters</span>
                  </div>

                  {/* Past Entries Collapsible */}
                  {currentSession.turns.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <button
                        onClick={() => setShowPastEntries(!showPastEntries)}
                        style={{
                          background: 'none',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        {showPastEntries ? '▼' : '▶'} Collapsible past entries ({currentSession.turns.length})
                      </button>
                      
                      {showPastEntries && (
                        <div style={{
                          border: '1px solid #e5e7eb',
                          borderTop: 'none',
                          borderRadius: '0 0 6px 6px',
                          padding: '1rem',
                          background: '#f9fafb'
                        }}>
                          {currentSession.turns.map((turn, index) => (
                            <div key={index} style={{ marginBottom: '1rem' }}>
                              <strong>Round {turn.turnNumber}:</strong>
                              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                {getContentDisplay('colors', turn.color)?.name || turn.color} • {' '}
                                {getContentDisplay('techniques', turn.technique)?.name || turn.technique} • {' '}
                                {getContentDisplay('mediums', turn.medium)?.name || turn.medium}
                              </div>
                              {turn.reflection && (
                                <div style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>
                                  "{turn.reflection}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={handleEndSession}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      End Session Now
                    </button>
                    
                    {currentSession.currentTurn < currentSession.plannedTurns ? (
                      <button
                        onClick={handleNextRound}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.75rem 1.5rem',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        Next Round →
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowFinalJournal(true)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.75rem 1.5rem',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        Complete Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Animations */}
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
