"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedTrophy() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create trophy
    const createTrophy = () => {
      const group = new THREE.Group();
      
      // Base
      const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        metalness: 0.7,
        roughness: 0.3
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1;
      group.add(base);
      
      // Stem
      const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
      const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee,
        metalness: 0.8,
        roughness: 0.2
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = 1;
      group.add(stem);
      
      // Cup
      const cupGeometry = new THREE.ConeGeometry(1.2, 1.5, 32);
      const cupMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.1
      });
      const cup = new THREE.Mesh(cupGeometry, cupMaterial);
      cup.position.y = 2.5;
      group.add(cup);
      
      return group;
    };

    const trophy = createTrophy();
    scene.add(trophy);
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      trophy.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}