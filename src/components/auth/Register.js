// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (displayName.trim().length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      await register(email, password, displayName.trim());
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && confirmPassword && displayName.trim() && 
                     Object.keys(validationErrors).length === 0;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
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
              Join create3x
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Start your creative journey today
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
              {error.includes('email-already-in-use') ? 'An account with this email already exists.' :
               error.includes('weak-password') ? 'Please choose a stronger password.' :
               error.includes('invalid-email') ? 'Please enter a valid email address.' :
               'Registration failed. Please try again.'}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-md">
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-xs)',
                color: 'var(--gray-700)',
                fontWeight: '500'
              }}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: `1px solid ${validationErrors.displayName ? '#ef4444' : 'var(--gray-300)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = validationErrors.displayName ? '#ef4444' : 'var(--primary-blue)'}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.displayName ? '#ef4444' : 'var(--gray-300)';
                  validateForm();
                }}
              />
              {validationErrors.displayName && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 'var(--space-xs)' }}>
                  {validationErrors.displayName}
                </p>
              )}
            </div>

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
                  border: `1px solid ${validationErrors.email ? '#ef4444' : 'var(--gray-300)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = validationErrors.email ? '#ef4444' : 'var(--primary-blue)'}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.email ? '#ef4444' : 'var(--gray-300)';
                  validateForm();
                }}
              />
              {validationErrors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 'var(--space-xs)' }}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="mb-md">
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
                placeholder="Create a password (min 6 characters)"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: `1px solid ${validationErrors.password ? '#ef4444' : 'var(--gray-300)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = validationErrors.password ? '#ef4444' : 'var(--primary-blue)'}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.password ? '#ef4444' : 'var(--gray-300)';
                  validateForm();
                }}
              />
              {validationErrors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 'var(--space-xs)' }}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="mb-lg">
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-xs)',
                color: 'var(--gray-700)',
                fontWeight: '500'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: `1px solid ${validationErrors.confirmPassword ? '#ef4444' : 'var(--gray-300)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = validationErrors.confirmPassword ? '#ef4444' : 'var(--primary-blue)'}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.confirmPassword ? '#ef4444' : 'var(--gray-300)';
                  validateForm();
                }}
              />
              {validationErrors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 'var(--space-xs)' }}>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: 'var(--space-sm)',
                fontSize: '1rem',
                opacity: (isLoading || !isFormValid) ? 0.6 : 1,
                cursor: (isLoading || !isFormValid) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-md">
            <p style={{ color: 'var(--gray-600)' }}>
              Already have an account?{' '}
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

export default Register;