"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import CLOUDS from 'vanta/dist/vanta.clouds.min'; // For star-like particles

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const netEffect = useRef(null);
  const cloudsEffect = useRef(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    // Initialize Vanta NET (web-like particles)
    netEffect.current = NET({
      el: vantaRef.current,
      THREE: THREE,
      color: 0xcc3366,       // Cosmic pink-maroon
      backgroundColor: 0x0,   // Pure black
      points: 15,             // Number of particles
      maxDistance: 25,        // Connection distance
      spacing: 18,            // Particle spacing
      showDots: true          // Render particles as dots
    });

    // Initialize Vanta CLOUDS (floating star-like particles)
    cloudsEffect.current = CLOUDS({
      el: vantaRef.current,
      THREE: THREE,
      skyColor: 0x0,          // Black background
      cloudColor: 0xaa44aa,   // Purple-pink nebula
      sunColor: 0xcc3366,      // Maroon glow
      sunGlareColor: 0xffffff, // White twinkles
      speed: 0.3               // Slow drift
    });

    return () => {
      if (netEffect.current) netEffect.current.destroy();
      if (cloudsEffect.current) cloudsEffect.current.destroy();
    };
  }, []);

  return (
    <div 
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'radial-gradient(ellipse at center, #1a0d1a 0%, #000000 100%)'
      }}
    />
  );
}