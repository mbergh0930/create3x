// src/components/session/GameWheel.jsx
import React, { useState, useEffect } from 'react';

const GameWheel = ({ 
  size = 300, 
  options = [], 
  onResult, 
  title = "Spin the Wheel!",
  subtitle = "Click to spin",
  centerIcon = "🎲",
  colors = [
    'var(--primary-blue)',
    'var(--accent-purple)', 
    'var(--primary-yellow)',
    'var(--primary-red)',
    'var(--accent-emerald)',
    'var(--accent-orange)'
  ]
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Calculate segment angle
  const segmentAngle = 360 / options.length;

  const handleSpin = () => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Generate random result
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    // Calculate final rotation
    const spins = 4 + Math.random() * 3; // 4-7 full rotations
    const finalAngle = (spins * 360) + (randomIndex * segmentAngle);
    
    setRotation(prev => prev + finalAngle);

    // Show result after animation
    setTimeout(() => {
      setResult(selectedOption);
      setShowResult(true);
      setIsSpinning(false);
      
      if (onResult) {
        onResult(selectedOption, randomIndex);
      }
    }, 3000); // 3 second spin duration
  };

  // Create wheel segments
  const createSegments = () => {
    return options.map((option, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const color = colors[index % colors.length];
      
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            transformOrigin: 'right bottom',
            transform: `rotate(${startAngle}deg)`,
            clipPath: `polygon(0 100%, 100% 100%, ${Math.cos(segmentAngle * Math.PI / 180) * 100}% ${100 - Math.sin(segmentAngle * Math.PI / 180) * 100}%)`,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: index === 2 ? 'var(--gray-900)' : 'white', // Dark text on yellow
            textAlign: 'center',
            padding: '10px'
          }}
        >
          <span style={{
            transform: `rotate(${segmentAngle / 2}deg)`,
            whiteSpace: 'nowrap'
          }}>
            {typeof option === 'object' ? option.display : option}
          </span>
        </div>
      );
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-xl)',
      padding: 'var(--space-lg)'
    }}>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-display mb-sm" style={{ 
          fontSize: '1.8rem',
          color: 'var(--gray-900)'
        }}>
          {title}
        </h2>
        <p style={{ color: 'var(--gray-600)' }}>
          {isSpinning ? 'Spinning...' : showResult ? 'Result!' : subtitle}
        </p>
      </div>

      {/* Wheel Container */}
      <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        cursor: isSpinning ? 'default' : 'pointer'
      }} onClick={handleSpin}>
        
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '25px solid var(--gray-900)',
          zIndex: 10,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }} />

        {/* Wheel */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            border: '6px solid var(--white)',
            boxShadow: 'var(--shadow-lg)',
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            background: 'var(--gray-100)'
          }}
        >
          {/* Wheel Segments */}
          {createSegments()}
        </div>

        {/* Center Circle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: '600',
          color: 'var(--gray-700)',
          boxShadow: 'var(--shadow-md)',
          border: '3px solid var(--gray-200)',
          zIndex: 5
        }}>
          {isSpinning ? '🌀' : centerIcon}
        </div>
      </div>

      {/* Click to Spin Button */}
      {!isSpinning && !showResult && (
        <div className="text-center">
          <button 
            onClick={handleSpin}
            className="btn btn-primary"
            style={{
              fontSize: '1.2rem',
              padding: 'var(--space-md) var(--space-xl)',
              animation: 'pulse 2s infinite',
              boxShadow: 'var(--shadow-lg)',
              border: 'none',
              minWidth: '200px'
            }}
          >
            🎲 Click to Spin!
          </button>
          
          <p style={{ 
            color: 'var(--gray-600)', 
            fontSize: '0.9rem', 
            marginTop: 'var(--space-sm)' 
          }}>
            Click the wheel or button to spin
          </p>
        </div>
      )}

      {/* Result Display */}
      {showResult && result && (
        <div 
          className="text-center"
          style={{
            opacity: showResult ? 1 : 0,
            transform: showResult ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.5s ease',
            background: 'var(--white)',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid var(--primary-blue)'
          }}
        >
          <h3 className="text-display mb-sm" style={{ 
            fontSize: '1.5rem',
            color: 'var(--primary-blue)'
          }}>
            Result!
          </h3>
          <p style={{ 
            fontSize: '1.3rem',
            fontWeight: '600',
            color: 'var(--gray-900)'
          }}>
            {typeof result === 'object' ? result.display : result}
          </p>
        </div>
      )}

      {/* Add pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default GameWheel;