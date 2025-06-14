// src/contexts/SessionContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

// Creative content database
const CONTENT = {
  colors: {
    'ultramarine-blue': { name: 'Ultramarine Blue', category: 'blue', intensity: 'vibrant' },
    'cadmium-yellow': { name: 'Cadmium Yellow', category: 'yellow', intensity: 'bright' },
    'alizarin-crimson': { name: 'Alizarin Crimson', category: 'red', intensity: 'deep' },
    'burnt-sienna': { name: 'Burnt Sienna', category: 'brown', intensity: 'warm' },
    'phthalo-green': { name: 'Phthalo Green', category: 'green', intensity: 'intense' },
    'raw-umber': { name: 'Raw Umber', category: 'brown', intensity: 'earthy' },
    'cobalt-blue': { name: 'Cobalt Blue', category: 'blue', intensity: 'pure' },
    'cadmium-red': { name: 'Cadmium Red', category: 'red', intensity: 'bright' },
    'yellow-ochre': { name: 'Yellow Ochre', category: 'yellow', intensity: 'muted' },
    'titanium-white': { name: 'Titanium White', category: 'neutral', intensity: 'pure' },
    'ivory-black': { name: 'Ivory Black', category: 'neutral', intensity: 'deep' },
    'vermillion': { name: 'Vermillion', category: 'red', intensity: 'vibrant' },
    'cerulean-blue': { name: 'Cerulean Blue', category: 'blue', intensity: 'soft' },
    'viridian': { name: 'Viridian', category: 'green', intensity: 'cool' },
    'burnt-umber': { name: 'Burnt Umber', category: 'brown', intensity: 'rich' }
  },
  
  techniques: {
    'impasto': { name: 'Impasto', description: 'Thick application of paint' },
    'glazing': { name: 'Glazing', description: 'Transparent color layers' },
    'scumbling': { name: 'Scumbling', description: 'Broken color technique' },
    'dry-brush': { name: 'Dry Brush', description: 'Minimal paint on brush' },
    'wet-on-wet': { name: 'Wet on Wet', description: 'Paint into wet paint' },
    'stippling': { name: 'Stippling', description: 'Dotting technique' },
    'cross-hatching': { name: 'Cross Hatching', description: 'Intersecting lines' },
    'blending': { name: 'Blending', description: 'Smooth color transitions' },
    'sgraffito': { name: 'Sgraffito', description: 'Scratching through paint' },
    'pointillism': { name: 'Pointillism', description: 'Small dots of color' },
    'alla-prima': { name: 'Alla Prima', description: 'Paint in one session' },
    'grisaille': { name: 'Grisaille', description: 'Monochromatic technique' },
    'sfumato': { name: 'Sfumato', description: 'Soft, smoky transitions' },
    'chiaroscuro': { name: 'Chiaroscuro', description: 'Strong light/dark contrast' }
  },
  
  mediums: {
    'oil-paint': { name: 'Oil Paint', type: 'traditional', dryTime: 'slow' },
    'acrylic': { name: 'Acrylic', type: 'modern', dryTime: 'fast' },
    'watercolor': { name: 'Watercolor', type: 'traditional', dryTime: 'fast' },
    'gouache': { name: 'Gouache', type: 'traditional', dryTime: 'medium' },
    'tempera': { name: 'Tempera', type: 'traditional', dryTime: 'fast' },
    'pastel': { name: 'Soft Pastel', type: 'traditional', dryTime: 'immediate' },
    'charcoal': { name: 'Charcoal', type: 'traditional', dryTime: 'immediate' },
    'ink': { name: 'Ink', type: 'traditional', dryTime: 'fast' },
    'digital': { name: 'Digital', type: 'modern', dryTime: 'immediate' },
    'mixed-media': { name: 'Mixed Media', type: 'experimental', dryTime: 'varies' },
    'encaustic': { name: 'Encaustic (Wax)', type: 'traditional', dryTime: 'fast' },
    'spray-paint': { name: 'Spray Paint', type: 'modern', dryTime: 'fast' }
  }
};

// Master artists database (simplified for now)
const ARTISTS = {
  'van-gogh': {
    name: 'Vincent van Gogh',
    colors: ['ultramarine-blue', 'cadmium-yellow', 'vermillion', 'viridian'],
    techniques: ['impasto', 'alla-prima'],
    mediums: ['oil-paint']
  },
  'monet': {
    name: 'Claude Monet',
    colors: ['cerulean-blue', 'cadmium-yellow', 'alizarin-crimson', 'viridian'],
    techniques: ['alla-prima', 'broken-color'],
    mediums: ['oil-paint']
  },
  'picasso': {
    name: 'Pablo Picasso',
    colors: ['cobalt-blue', 'burnt-sienna', 'ivory-black', 'titanium-white'],
    techniques: ['dry-brush', 'cross-hatching'],
    mediums: ['oil-paint', 'charcoal']
  }
};

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { user } = useAuth();

  // Get random element from array
  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Create new session
  const createSession = async (mode, config = {}) => {
    if (!user) throw new Error('User must be logged in to create session');

    try {
      // Generate random number of turns (3-8)
      const plannedTurns = Math.floor(Math.random() * 6) + 3;

      const sessionData = {
        userId: user.uid,
        mode, // 'play', 'play-and-journal', 'master-artist'
        artistId: config.artistId || null,
        artistFocus: config.artistFocus || 'all', // 'all', 'colors-only', 'techniques-only', 'mediums-only'
        plannedTurns,
        completedTurns: 0,
        currentTurn: 1,
        turns: [],
        finalReflection: '',
        finalReflectionProvided: false,
        imageUrl: '',
        createdAt: new Date(),
        completedAt: null,
        endedEarly: false,
        shareSettings: {
          isPublic: false,
          sharePersonalInfo: false,
          shareSessionDetails: true
        }
      };

      // Add to Firestore
      const sessionRef = await addDoc(collection(db, 'sessions'), sessionData);
      
      // Update with ID
      const sessionWithId = { ...sessionData, id: sessionRef.id };
      await updateDoc(sessionRef, { id: sessionRef.id });

      setCurrentSession(sessionWithId);
      return sessionWithId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  // Generate turn data
  const generateTurn = async (sessionId, turnNumber) => {
    if (!currentSession) throw new Error('No active session');

    try {
      let availableColors = Object.keys(CONTENT.colors);
      let availableTechniques = Object.keys(CONTENT.techniques);
      let availableMediums = Object.keys(CONTENT.mediums);

      // Apply artist constraints if in master-artist mode
      if (currentSession.mode === 'master-artist' && currentSession.artistId) {
        const artist = ARTISTS[currentSession.artistId];
        
        if (currentSession.artistFocus === 'colors-only' || currentSession.artistFocus === 'all') {
          availableColors = artist.colors;
        }
        if (currentSession.artistFocus === 'techniques-only' || currentSession.artistFocus === 'all') {
          availableTechniques = artist.techniques;
        }
        if (currentSession.artistFocus === 'mediums-only' || currentSession.artistFocus === 'all') {
          availableMediums = artist.mediums;
        }
      }

      const turnData = {
        turnNumber,
        color: getRandomElement(availableColors),
        technique: getRandomElement(availableTechniques),
        medium: getRandomElement(availableMediums),
        reflection: '',
        reflectionProvided: false,
        createdAt: new Date()
      };

      return turnData;
    } catch (error) {
      console.error('Error generating turn:', error);
      throw error;
    }
  };

  // Complete turn and save to database
  const completeTurn = async (turnData, reflection = '') => {
    if (!currentSession) throw new Error('No active session');

    try {
      const updatedTurn = {
        ...turnData,
        reflection,
        reflectionProvided: !!reflection
      };

      const updatedTurns = [...currentSession.turns, updatedTurn];
      const updatedSession = {
        ...currentSession,
        turns: updatedTurns,
        completedTurns: updatedTurns.length,
        currentTurn: currentSession.currentTurn + 1
      };

      // Update Firestore
      const sessionRef = doc(db, 'sessions', currentSession.id);
      await updateDoc(sessionRef, {
        turns: updatedTurns,
        completedTurns: updatedTurns.length,
        currentTurn: currentSession.currentTurn + 1
      });

      setCurrentSession(updatedSession);
      return updatedSession;
    } catch (error) {
      console.error('Error completing turn:', error);
      throw error;
    }
  };

  // End session
  const endSession = async (early = false, finalReflection = '') => {
    if (!currentSession) throw new Error('No active session');

    try {
      const updatedSession = {
        ...currentSession,
        completedAt: new Date(),
        endedEarly: early,
        finalReflection,
        finalReflectionProvided: !!finalReflection
      };

      // Update Firestore
      const sessionRef = doc(db, 'sessions', currentSession.id);
      await updateDoc(sessionRef, {
        completedAt: new Date(),
        endedEarly: early,
        finalReflection,
        finalReflectionProvided: !!finalReflection
      });

      // Update user stats (simplified for now)
      // TODO: Update user profile with completed session stats

      setCurrentSession(null);
      return updatedSession;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  // Get content for display
  const getContentDisplay = (type, key) => {
    return CONTENT[type][key] || { name: key };
  };

  // Get artists list
  const getArtists = () => {
    return ARTISTS;
  };

  const value = {
    currentSession,
    isSpinning,
    setIsSpinning,
    createSession,
    generateTurn,
    completeTurn,
    endSession,
    getContentDisplay,
    getArtists,
    CONTENT,
    ARTISTS
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};