// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStartSession = async (mode) => {
  console.log('Button clicked!', mode);
  window.location.href = `/pre-session?mode=${mode}`;
};

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
              fontSize: '1.8rem',
              background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              create3x
            </h1>
            <p style={{ color: 'var(--gray-600)', marginTop: 'var(--space-xs)' }}>
              eXpand • eXplore • eXperience
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--gray-700)' }}>
              Welcome, {userProfile?.displayName || user?.displayName || 'Creative Explorer'}!
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
        <div className="text-center">
          <h2 className="text-display mb-md" style={{ 
            fontSize: '2.5rem',
            color: 'var(--gray-900)'
          }}>
            TESTING - Ready to Create?
          </h2>
          
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Simple button test below:
          </p>

          {/* Super Simple Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleStartSession('play')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start Playing
            </button>

            <button 
              onClick={() => handleStartSession('play-and-journal')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: 'purple',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start & Reflect
            </button>

            <button 
              onClick={() => handleStartSession('master-artist')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: 'orange',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Study Masters
            </button>
          </div>

          <p style={{ marginTop: '2rem', color: 'gray' }}>
            If you see these buttons, the issue was with the card styling.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;