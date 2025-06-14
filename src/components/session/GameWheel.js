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
            color: index === 2 ? '#111827' : 'white', // Dark text on yellow
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
      gap: '2rem',
      padding: '2rem'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '1.8rem',
          color: '#111827',
          marginBottom: '0.5rem',
          fontWeight: '600'
        }}>
          {title}
        </h2>
        <p style={{ color: '#6b7280' }}>
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
          borderBottom: '25px solid #111827',
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
            border: '6px solid white',
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            background: '#f3f4f6'
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
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: '600',
          color: '#4b5563',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '3px solid #e5e7eb',
          zIndex: 5
        }}>
          {isSpinning ? '🌀' : centerIcon}
        </div>
      </div>

      {/* Click to Spin Button */}
      {!isSpinning && !showResult && (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleSpin}
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              minWidth: '200px',
              animation: 'pulse 2s infinite'
            }}
          >
            🎲 Click to Spin!
          </button>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9rem', 
            marginTop: '0.5rem' 
          }}>
            Click the wheel or button to spin
          </p>
        </div>
      )}

      {/* Result Display */}
      {showResult && result && (
        <div 
          style={{
            textAlign: 'center',
            opacity: showResult ? 1 : 0,
            transform: showResult ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.5s ease',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '2px solid #2563eb'
          }}
        >
          <h3 style={{ 
            fontSize: '1.5rem',
            color: '#2563eb',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Result!
          </h3>
          <p style={{ 
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#111827'
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