// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
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
              Welcome Back
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Sign in to continue your creative journey
            </p>
          </div>

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
              {error.includes('user-not-found') ? 'No account found with this email.' :
               error.includes('wrong-password') ? 'Incorrect password.' :
               error.includes('invalid-email') ? 'Please enter a valid email address.' :
               'Login failed. Please try again.'}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-md">
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-xs)',
                color: 'var(--gray-700)',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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

            <div className="mb-lg">
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-xs)',
                color: 'var(--gray-700)',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

{/* Forgot Password Link */}
<div style={{ textAlign: 'right', marginBottom: 'var(--space-md)' }}>
  <Link 
    to="/reset-password"
    style={{ 
      color: 'var(--primary-blue)',
      textDecoration: 'none',
      fontSize: '0.9rem'
    }}
    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
  >
    Forgot your password?
  </Link>
</div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: 'var(--space-sm)',
                fontSize: '1rem',
                opacity: (isLoading || !email || !password) ? 0.6 : 1,
                cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-md">
            <p style={{ color: 'var(--gray-600)' }}>
              Don't have an account?{' '}
              <Link 
                to="/register"
                style={{ 
                  color: 'var(--primary-blue)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Create one here
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

export default Login;