// src/pages/PreSessionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';

const PreSessionFlow = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { createSession } = useSession();
  const [step, setStep] = useState('ready');
  const [selectedRounds, setSelectedRounds] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  // Get mode and rounds from URL params if provided
  useEffect(() => {
    const mode = searchParams.get('mode');
    const rounds = searchParams.get('rounds');
    
    if (mode) {
      setSelectedMode(mode);
    }
    
    if (rounds) {
      const roundsNum = parseInt(rounds);
      if (roundsNum >= 1 && roundsNum <= 5) {
        setSelectedRounds(roundsNum);
        // Skip directly to creating session if we have both params
        if (mode) {
          handleModeSelection(mode, roundsNum);
        }
      }
    }
  }, [searchParams]);

  const handleModeSelection = async (mode, rounds = selectedRounds) => {
    if (!rounds) return;

    try {
      setIsCreating(true);
      console.log('Creating session...', { mode, rounds });
      
      // Map mode names to what SessionContext expects
      let sessionMode = mode;
      let config = {};
      
      if (mode === 'inspire') {
        sessionMode = 'inspire';
      } else if (mode === 'masters') {
        sessionMode = 'masters';
        config.artistId = 'van-gogh';
        config.artistFocus = 'all';
      }
      
      const session = await createSession(sessionMode, config, rounds);
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

  if (!user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem',
          background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '600',
          marginBottom: '2rem'
        }}>
          create3x
        </h1>
        
        {isCreating ? (
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p>Creating your session...</p>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
              Starting Your Session
            </h2>
            <p style={{ color: '#6b7280' }}>
              Setting up your creative session...
            </p>
          </div>
        )}
      </div>
      
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

export default PreSessionFlow;
