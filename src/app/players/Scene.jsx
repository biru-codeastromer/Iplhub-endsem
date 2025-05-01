import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function Galaxy() {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(20000), { radius: 10 }));

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 30;
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0
      }}
      gl={{
        antialias: true,
        alpha: true
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
      <Galaxy />
    </Canvas>
  );
}

export default Scene;