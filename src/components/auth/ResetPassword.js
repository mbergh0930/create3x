// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');
      clearError();
      await resetPassword(email);
      setMessage('Check your email for password reset instructions!');
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-padding">
          {/* Header */}
          <div className="text-center mb-lg">
            <h1 className="text-display" style={{ 
              fontSize: '1.8rem',
              background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'var(--space-xs)'
            }}>
              Reset Password
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Enter your email to receive reset instructions
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm)',
              marginBottom: 'var(--space-md)',
              color: '#166534'
            }}>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm)',
              marginBottom: 'var(--space-md)',
              color: '#dc2626'
            }}>
              {error.includes('user-not-found') ? 'No account found with this email address.' :
               error.includes('invalid-email') ? 'Please enter a valid email address.' :
               'Error sending reset email. Please try again.'}
            </div>
          )}

          {/* Reset Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-lg">
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-xs)',
                color: 'var(--gray-700)',
                fontWeight: '500'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: 'var(--space-sm)',
                fontSize: '1rem',
                opacity: (isLoading || !email) ? 0.6 : 1,
                cursor: (isLoading || !email) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-md">
            <p style={{ color: 'var(--gray-600)' }}>
              Remember your password?{' '}
              <Link 
                to="/login"
                style={{ 
                  color: 'var(--primary-blue)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-sm">
            <Link 
              to="/"
              style={{ 
                color: 'var(--gray-500)',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--gray-700)'}
              onMouseOut={(e) => e.target.style.color = 'var(--gray-500)'}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;