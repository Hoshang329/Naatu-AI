import React from 'react';
import './BackgroundParticles.css'; // We will create this CSS file next

// This function generates a random number in a given range
const random = (min, max) => Math.random() * (max - min) + min;

// We'll create 30 particles
const particleCount = 200;
const particles = Array.from({ length: particleCount }).map(() => ({
  // Generate random properties for each particle
  size: random(3, 8), // size between 3px and 8px
  left: random(0, 100), // horizontal position from 0% to 100%
  top: random(0, 100),   // vertical position from 0% to 100%
  delay: random(0, 0.1), // animation delay up to 10 seconds
  duration: random(10, 30), // animation duration between 10 and 30 seconds
}));

function BackgroundParticles() {
  return (
    <div className="particle-container">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--size': `${p.size}px`,
            '--left': `${p.left}%`,
            '--top': `${p.top}%`,
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default BackgroundParticles;