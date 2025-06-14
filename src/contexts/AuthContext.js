// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create user profile in Firestore
  const createUserProfile = async (user, displayName) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || user.displayName || 'Creative Explorer',
          email: user.email,
          createdAt: new Date(),
          completedSessions: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalTurns: 0,
          favoriteMode: null,
          lastSessionDate: null
        });
      }
      
      // Get the profile data
      const profile = await getDoc(userRef);
      return profile.data();
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, displayName) => {
    try {
      setError('');
      setLoading(true);
      
      // Create user account
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Create user profile in Firestore
      await createUserProfile(result.user, displayName);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
const resetPassword = async (email) => {
  try {
    setError('');
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    setError(error.message);
    throw error;
  }
};
  // Logout function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    setError('');
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get user profile from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create profile if it doesn't exist
            const profile = await createUserProfile(user);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Error loading user profile');
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    login,
    register,
    logout,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};