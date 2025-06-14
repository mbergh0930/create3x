// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthGuard from './components/auth/AuthGuard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import './styles/design-system.css';
import PreSessionFlow from './pages/PreSessionFlow';
import { SessionProvider } from './contexts/SessionContext';
import './App.css';

// Landing Page Component
const LandingPage = () => {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="App">
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
              fontSize: '2rem',
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
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Link to="/login">
              <button className="btn btn-secondary">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
        <div className="text-center">
          <h2 className="text-display mb-md" style={{ 
            fontSize: '3rem',
            color: 'var(--gray-900)'
          }}>
            Welcome to Creative Freedom
          </h2>
          
          <p className="mb-lg" style={{ 
            fontSize: '1.2rem',
            color: 'var(--gray-600)',
            maxWidth: '600px',
            margin: '0 auto var(--space-lg) auto'
          }}>
            Break out of your creative box. Let randomization guide your artistic journey 
            through colors, techniques, and mediums you never considered.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-md)', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/register">
              <button className="btn btn-primary" style={{ 
                fontSize: '1.1rem', 
                padding: 'var(--space-md) var(--space-lg)' 
              }}>
                Start Creating
              </button>
            </Link>
            <button className="btn btn-secondary" style={{ 
              fontSize: '1.1rem', 
              padding: 'var(--space-md) var(--space-lg)' 
            }}>
              Learn More
            </button>
          </div>

          {/* Feature Preview */}
          <div style={{ 
            marginTop: 'var(--space-2xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            <div className="card card-padding text-center">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary-blue)', 
                borderRadius: 'var(--radius-full)',
                margin: '0 auto var(--space-md) auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🎨
              </div>
              <h3 className="text-display mb-sm">Just Play</h3>
              <p style={{ color: 'var(--gray-600)', textAlign: 'left' }}>
                Spin for random colors, techniques, and mediums. Pure creative flow.
              </p>
            </div>

            <div className="card card-padding text-center">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--accent-purple)', 
                borderRadius: 'var(--radius-full)',
                margin: '0 auto var(--space-md) auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                📝
              </div>
              <h3 className="text-display mb-sm">Play & Journal</h3>
              <p style={{ color: 'var(--gray-600)', textAlign: 'left' }}>
                Reflect on each step of your creative journey and track your growth.
              </p>
            </div>

            <div className="card card-padding text-center">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary-yellow)', 
                borderRadius: 'var(--radius-full)',
                margin: '0 auto var(--space-md) auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🎭
              </div>
              <h3 className="text-display mb-sm">Study Masters</h3>
              <p style={{ color: 'var(--gray-600)', textAlign: 'left' }}>
                Explore the palettes and techniques of legendary artists.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <SessionProvider>        {/* ← This must wrap everything */}
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />

          <Route path="/pre-session" element={
  <AuthGuard>
    <PreSessionFlow />
  </AuthGuard>
} />
          
          {/* Catch all route - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </SessionProvider>       {/* ← Don't forget to close it */}
    </AuthProvider>
  );
}

export default App;