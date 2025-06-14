// src/components/auth/AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gray-50)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)'
        }}>
          {/* Spinning loader */}
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--gray-200)',
            borderTop: '4px solid var(--primary-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          
          <h2 className="text-display" style={{ 
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            create3x
          </h2>
          
          <p style={{ color: 'var(--gray-600)' }}>
            Loading your creative space...
          </p>
        </div>

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
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default AuthGuard;