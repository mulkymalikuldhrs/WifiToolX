
"use client";

import React, { useState, useEffect } from 'react';

export function BackgroundAnimation() {
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }).map(() => {
        const size = Math.floor(Math.random() * 5 + 2);
        const animationDuration = Math.random() * 5 + 5;
        const animationDelay = Math.random() * 5;
        return {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
        };
      });
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {particles.map((style, index) => (
        <div key={index} className="particle" style={style} />
      ))}
    </div>
  );
}
