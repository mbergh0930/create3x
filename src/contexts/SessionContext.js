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
  // Simple colors for "Inspire Me" mode
  inspireColors: {
    'red': { name: 'Red', category: 'warm' },
    'orange': { name: 'Orange', category: 'warm' },
    'yellow': { name: 'Yellow', category: 'warm' },
    'green': { name: 'Green', category: 'cool' },
    'blue': { name: 'Blue', category: 'cool' },
    'indigo': { name: 'Indigo', category: 'cool' },
    'purple': { name: 'Purple', category: 'cool' },
    'pink': { name: 'Pink', category: 'warm' },
    'peach': { name: 'Peach', category: 'warm' },
    'turquoise': { name: 'Turquoise', category: 'cool' },
    'teal': { name: 'Teal', category: 'cool' },
    'black': { name: 'Black', category: 'neutral' },
    'white': { name: 'White', category: 'neutral' },
    'brown': { name: 'Brown', category: 'neutral' },
    'gray': { name: 'Gray', category: 'neutral' }
  },

  // Simple techniques for "Inspire Me" mode
  inspireTechniques: {
    'splatter': { name: 'Splatter', description: 'Flick paint for texture' },
    'drip': { name: 'Drip', description: 'Let paint flow down' },
    'remove': { name: 'Remove', description: 'Take paint away to create' },
    'fingers': { name: 'Fingers', description: 'Paint with your fingertips' },
    'stencils': { name: 'Stencils', description: 'Use shapes to block paint' },
    'stamps': { name: 'Stamps', description: 'Press objects into paint' },
    'mark-making': { name: 'Mark Making', description: 'Create expressive marks' },
    'blot': { name: 'Blot', description: 'Press and lift for texture' },
    'scratch': { name: 'Scratch', description: 'Scrape through wet paint' },
    'dab': { name: 'Dab', description: 'Gentle pressing motions' },
    'swirl': { name: 'Swirl', description: 'Circular mixing motions' },
    'layer': { name: 'Layer', description: 'Build up transparent layers' }
  },

  // Simple mediums for "Inspire Me" mode  
  inspireMediums: {
    'paper': { name: 'Paper', type: 'surface' },
    'watercolor': { name: 'Watercolor', type: 'paint' },
    'acrylic': { name: 'Acrylic', type: 'paint' },
    'ink': { name: 'Ink', type: 'liquid' },
    'spray': { name: 'Spray Paint', type: 'paint' },
    'crayon': { name: 'Crayon', type: 'waxy' },
    'gesso': { name: 'Gesso', type: 'primer' },
    'charcoal': { name: 'Charcoal', type: 'drawing' },
    'pastel': { name: 'Pastel', type: 'drawing' },
    'marker': { name: 'Marker', type: 'drawing' },
    'pencil': { name: 'Colored Pencil', type: 'drawing' },
    'chalk': { name: 'Chalk', type: 'drawing' }
  },

  // Professional colors for Master Artists mode
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

// Master artists database
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
    techniques: ['alla-prima', 'wet-on-wet'],
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
  const createSession = async (mode, config = {}, plannedTurns = null) => {
    if (!user) throw new Error('User must be logged in to create session');

    try {
      // Use provided turns or generate random (3-7)
      const finalTurns = plannedTurns || Math.floor(Math.random() * 5) + 3;

      const sessionData = {
        userId: user.uid,
        mode, // 'inspire', 'masters', 'play', 'play-and-journal', 'master-artist'
        artistId: config.artistId || null,
        artistFocus: config.artistFocus || 'all',
        plannedTurns: finalTurns,
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
      let availableColors, availableTechniques, availableMediums;

      // Choose data source based on mode
      if (currentSession.mode === 'inspire') {
        availableColors = Object.keys(CONTENT.inspireColors);
        availableTechniques = Object.keys(CONTENT.inspireTechniques);
        availableMediums = Object.keys(CONTENT.inspireMediums);
      } else if (currentSession.mode === 'masters' || currentSession.mode === 'master-artist') {
        // For masters mode, use artist-specific data
        availableColors = Object.keys(CONTENT.colors);
        availableTechniques = Object.keys(CONTENT.techniques);
        availableMediums = Object.keys(CONTENT.mediums);

        // Apply artist constraints if artist is selected
        if (currentSession.artistId) {
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
      } else {
        // Default to inspire mode for other modes
        availableColors = Object.keys(CONTENT.inspireColors);
        availableTechniques = Object.keys(CONTENT.inspireTechniques);
        availableMediums = Object.keys(CONTENT.inspireMediums);
      }

      const turnData = {
        turnNumber,
        color: getRandomElement(availableColors),
        technique: getRandomElement(availableTechniques),
        medium: getRandomElement(availableMediums),
        artist: currentSession.artistId ? ARTISTS[currentSession.artistId].name : null,
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

      setCurrentSession(null);
      return updatedSession;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  // Get content for display
  const getContentDisplay = (type, key) => {
    // Choose the right content source based on session mode
    if (currentSession && currentSession.mode === 'inspire') {
      if (type === 'colors') return CONTENT.inspireColors[key] || { name: key };
      if (type === 'techniques') return CONTENT.inspireTechniques[key] || { name: key };
      if (type === 'mediums') return CONTENT.inspireMediums[key] || { name: key };
    }
    
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
