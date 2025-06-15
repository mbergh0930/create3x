// src/components/session/SlotMachine.jsx
import React, { useState, useEffect } from 'react';

const SlotMachine = ({ 
  isSpinning, 
  result, 
  onSpinComplete, 
  mode = 'inspire' 
}) => {
  const [windowStates, setWindowStates] = useState({
    1: { isSpinning: false, content: '?' },
    2: { isSpinning: false, content: '?' },
    3: { isSpinning: false, content: '?' }
  });
  
  const [showSpin, setShowSpin] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Labels for windows based on mode
  const getWindowLabels = () => {
    if (mode === 'masters' || mode === 'master-artist') {
      return ['ARTIST', 'TECHNIQUE', 'MEDIUM'];
    }
    return ['COLOR', 'TECHNIQUE', 'MEDIUM'];
  };

  // Sample spinning content for animation
  const getSpinningContent = (windowNumber) => {
    if (mode === 'masters' || mode === 'master-artist') {
      if (windowNumber === 1) return ['Van Gogh', 'Monet', 'Picasso', 'Da Vinci', 'Renoir'];
      if (windowNumber === 2) return ['Impasto', 'Glazing', 'Wet on Wet', 'Alla Prima', 'Scumbling'];
      if (windowNumber === 3) return ['Oil Paint', 'Watercolor', 'Acrylic', 'Pastel', 'Charcoal'];
    } else {
      if (windowNumber === 1) return ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Pink'];
      if (windowNumber === 2) return ['Splatter', 'Drip', 'Fingers', 'Scratch', 'Dab', 'Swirl'];
      if (windowNumber === 3) return ['Watercolor', 'Acrylic', 'Ink', 'Crayon', 'Paper', 'Spray'];
    }
    return ['?'];
  };

  // Start spinning animation
  const startSpin = () => {
    if (!result) return;
    
    setHasStarted(true);
    setShowSpin(false);
    
    // Start all windows spinning
    setWindowStates({
      1: { isSpinning: true, content: '?' },
      2: { isSpinning: true, content: '?' },
      3: { isSpinning: true, content: '?' }
    });

    // Stop window 1 after 2 seconds
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        1: { 
          isSpinning: false, 
          content: mode === 'masters' || mode === 'master-artist' 
            ? (result.artist || 'Master Artist')
            : result.colorDisplay?.name || result.color 
        }
      }));
    }, 2000);

    // Stop window 2 after 3 seconds  
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        2: { 
          isSpinning: false, 
          content: result.techniqueDisplay?.name || result.technique 
        }
      }));
    }, 3000);

    // Stop window 3 after 4 seconds
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        3: { 
          isSpinning: false, 
          content: result.mediumDisplay?.name || result.medium 
        }
      }));
      
      // Notify parent that spinning is complete
      setTimeout(() => {
        if (onSpinComplete) onSpinComplete();
      }, 500);
    }, 4000);
  };

  // Reset when new result comes in
  useEffect(() => {
    if (result && !hasStarted) {
      setWindowStates({
        1: { isSpinning: false, content: '?' },
        2: { isSpinning: false, content: '?' },
        3: { isSpinning: false, content: '?' }
      });
      setShowSpin(true);
      setHasStarted(false);
    }
  }, [result]);

  const SpinningWindow = ({ windowNumber, state, label }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const spinContent = getSpinningContent(windowNumber);

    useEffect(() => {
      let interval;
      if (state.isSpinning) {
        interval = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % spinContent.length);
        }, 100); // Change content every 100ms for spinning effect
      }
      return () => clearInterval(interval);
    }, [state.isSpinning, spinContent.length]);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
      }}>
        {/* Label */}
        <div style={{
          background: '#374151',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px 8px 0 0',
          fontSize: '0.9rem',
          fontWeight: '600',
          width: '100%',
          textAlign: 'center',
          border: '2px solid #374151'
        }}>
          {label}
        </div>

        {/* Window */}
        <div style={{
          background: 'white',
          border: '2px solid #374151',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          width: '100%',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          fontWeight: '500',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            transform: state.isSpinning ? 'translateY(-10px)' : 'translateY(0)',
            transition: state.isSpinning ? 'none' : 'transform 0.3s ease',
            textAlign: 'center',
            padding: '0.5rem',
            animation: state.isSpinning ? 'bounce 0.1s infinite' : 'none'
          }}>
            {state.isSpinning ? spinContent[currentIndex] : state.content}
          </div>
          
          {/* Spinning overlay effect */}
          {state.isSpinning && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(0deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)',
              animation: 'shimmer 0.5s infinite'
            }} />
          )}
        </div>
      </div>
    );
  };

  const labels = getWindowLabels();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      {/* Round Information */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          display: 'inline-block',
          padding: '1rem 2rem',
          borderRadius: '12px',
          border: '3px solid #2563eb',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            margin: 0,
            color: '#2563eb'
          }}>
            ROUND {result?.turnNumber || 1} of {result?.totalTurns || 5}
          </h2>
        </div>
        
        <p style={{ 
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          {hasStarted 
            ? 'Discovering your creative elements...' 
            : 'Click SPIN to discover your creative prompts!'}
        </p>
      </div>

      {/* Slot Machine Windows */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center'
      }}>
        <SpinningWindow 
          windowNumber={1} 
          state={windowStates[1]} 
          label={labels[0]}
        />
        <SpinningWindow 
          windowNumber={2} 
          state={windowStates[2]} 
          label={labels[1]}
        />
        <SpinningWindow 
          windowNumber={3} 
          state={windowStates[3]} 
          label={labels[2]}
        />
      </div>

      {/* Spin Button */}
      {showSpin && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={startSpin}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            }}
          >
            🎰 SPIN
          </button>
        </div>
      )}

      {/* Add animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(-10px); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes shimmer {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default SlotMachine;
