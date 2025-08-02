import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';
import { ThemeSettings } from '@/types';

const BackgroundContainer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
  z-index: 0;
  opacity: 0.3;
`;

interface ClockBackgroundProps {
  theme: ThemeSettings;
}

function FloatingParticles({ count = 50, theme }: { count?: number; theme: ThemeSettings }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, index) => {
      const { position, rotation, scale, speed } = particle;
      
      dummy.position.set(
        position[0] + Math.sin(state.clock.elapsedTime * speed) * 2,
        position[1] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 2,
        position[2] + Math.sin(state.clock.elapsedTime * speed * 0.3) * 2
      );
      
      dummy.rotation.set(
        rotation[0] + state.clock.elapsedTime * speed,
        rotation[1] + state.clock.elapsedTime * speed * 0.5,
        rotation[2] + state.clock.elapsedTime * speed * 0.3
      );
      
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      
      if (mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
    });
    
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  const color = theme.isDarkMode ? theme.accentColor : theme.primaryColor;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.1]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

function TimeBasedLighting({ theme }: { theme: ThemeSettings }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame(() => {
    if (!lightRef.current) return;
    
    // Create time-based lighting that changes throughout the day
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timePercent = (hours + minutes / 60) / 24;
    
    // Adjust light intensity based on time of day
    const intensity = Math.sin(timePercent * Math.PI) * 0.8 + 0.2;
    lightRef.current.intensity = intensity;
    
    // Adjust light color temperature
    const warm = new THREE.Color('#ff8c42');
    const cool = new THREE.Color('#4287ff');
    const color = warm.clone().lerp(cool, Math.abs(Math.sin(timePercent * Math.PI * 2)));
    lightRef.current.color = color;
  });

  return (
    <>
      <directionalLight 
        ref={lightRef}
        position={[5, 5, 5]} 
        intensity={1}
        castShadow
      />
      <ambientLight intensity={theme.isDarkMode ? 0.2 : 0.4} />
    </>
  );
}

function AnimatedGeometry({ theme }: { theme: ThemeSettings }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    
    // Pulsing scale based on time
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <torusKnotGeometry args={[3, 1, 128, 16]} />
      <meshStandardMaterial 
        color={theme.primaryColor}
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

function GradientBackground({ theme }: { theme: ThemeSettings }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    
    if (theme.isDarkMode) {
      gradient.addColorStop(0, theme.backgroundGradient[0] || '#1a1a2e');
      gradient.addColorStop(0.5, theme.backgroundGradient[1] || '#16213e');
      gradient.addColorStop(1, theme.backgroundGradient[2] || '#0f0f1a');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
    }
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    return new THREE.CanvasTexture(canvas);
  }, [theme]);

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={gradientTexture} />
    </mesh>
  );
}

export const ClockBackground: React.FC<ClockBackgroundProps> = ({ theme }) => {
  return (
    <BackgroundContainer>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <GradientBackground theme={theme} />
        <TimeBasedLighting theme={theme} />
        <FloatingParticles count={30} theme={theme} />
        <AnimatedGeometry theme={theme} />
        
        <Environment preset={theme.isDarkMode ? 'night' : 'dawn'} />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </BackgroundContainer>
  );
};