// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const [rounds, setRounds] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePickRounds = () => {
    const randomRounds = Math.floor(Math.random() * 5) + 1; // Random number 1-5
    setRounds(randomRounds);
  };

  const handleStartSession = async (mode) => {
    const selectedRounds = rounds || Math.floor(Math.random() * 5) + 1;
    console.log('Starting session:', mode, 'Rounds:', selectedRounds);
    window.location.href = `/pre-session?mode=${mode}&rounds=${selectedRounds}`;
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
              Welcome, {userProfile?.displayName || user?.displayName || 'Michele'}!
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
        {/* Invitation Header */}
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem',
            color: 'var(--gray-900)',
            marginBottom: '1rem',
            fontWeight: '300'
          }}>
            An Invitation to Create
          </h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--gray-600)',
            marginBottom: '2rem' 
          }}>
            eXpand your thinking • eXplore new possibilities • eXperience creative joy
          </p>
        </div>

        {/* Number of Rounds Section */}
        <div style={{ 
          background: 'var(--white)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            marginBottom: '1rem',
            color: 'var(--gray-800)'
          }}>
            Number of Rounds
          </h3>
          
          <p style={{ 
            color: 'var(--gray-600)', 
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            Enter number of rounds (1-5) you'd like to explore or leave it to chance.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="number"
              min="1"
              max="5"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
              placeholder="Enter 1-5"
              style={{
                padding: '0.75rem',
                fontSize: '1.1rem',
                border: '2px solid var(--gray-300)',
                borderRadius: '8px',
                width: '120px',
                textAlign: 'center'
              }}
            />
            
            <button 
              onClick={handlePickRounds}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: 'var(--accent-purple)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Pick for Me!
            </button>
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            textAlign: 'center',
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            color: 'var(--gray-800)'
          }}>
            What would you like to do today?
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Inspire Me Card */}
            <div 
              onClick={() => handleStartSession('inspire')}
              style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <h4 style={{ 
                fontSize: '1.4rem', 
                marginBottom: '0.5rem',
                color: 'var(--primary-blue)'
              }}>
                Inspire Me
              </h4>
              <p style={{ 
                color: 'var(--gray-600)',
                lineHeight: '1.5'
              }}>
                Play with randomized elements
              </p>
            </div>

            {/* Explore the Masters Card */}
            <div 
              onClick={() => handleStartSession('masters')}
              style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <h4 style={{ 
                fontSize: '1.4rem', 
                marginBottom: '0.5rem',
                color: 'var(--accent-purple)'
              }}>
                Explore the Masters
              </h4>
              <p style={{ 
                color: 'var(--gray-600)',
                lineHeight: '1.5'
              }}>
                Guided by artist's tools
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            background: 'var(--white)',
            border: '2px solid var(--gray-300)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            <span>→</span> Continue Session
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            background: 'var(--white)',
            border: '2px solid var(--gray-300)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            <span>🏆</span> View Gallery
          </button>
        </div>

        {/* Stats and Sections */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {/* Current Streak */}
          <div style={{ 
            background: 'var(--white)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Current streak: <strong>3 days</strong>
            </p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Show badges earned w/ tool/tip hover explanation
            </p>
          </div>

          {/* Saved Drafts */}
          <div style={{ 
            background: 'var(--white)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ marginBottom: '1rem' }}>Saved Drafts</h4>
            <div style={{ 
              height: '80px', 
              background: 'var(--gray-100)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-500)'
            }}>
              No drafts yet
            </div>
          </div>

          {/* Recent Sessions */}
          <div style={{ 
            background: 'var(--white)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h4>Recent Sessions</h4>
              <button style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                View Leaderboard
              </button>
            </div>
            <div style={{ 
              height: '80px', 
              background: 'var(--gray-100)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-500)'
            }}>
              No sessions yet
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
