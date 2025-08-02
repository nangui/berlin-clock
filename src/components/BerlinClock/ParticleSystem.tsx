import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { Particle } from '@/types';

const ParticleCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: 24px;
`;

interface ParticleSystemProps {
  intensity: number;
  maxParticles?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  intensity, 
  maxParticles = 50 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    // Spawn particles from edges
    switch (side) {
      case 0: // Top
        x = Math.random() * canvas.width;
        y = 0;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 2 + 0.5;
        break;
      case 1: // Right
        x = canvas.width;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 2 + 0.5);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 2 + 0.5);
        break;
      default: // Left
        x = 0;
        y = Math.random() * canvas.height;
        vx = Math.random() * 2 + 0.5;
        vy = (Math.random() - 0.5) * 2;
        break;
    }

    return {
      id: Math.random().toString(36),
      x,
      y,
      vx: vx * intensity,
      vy: vy * intensity,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      size: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`, // Blue-cyan range
      opacity: Math.random() * 0.8 + 0.2
    };
  }, [intensity]);

  const updateParticle = useCallback((particle: Particle, deltaTime: number, canvas: HTMLCanvasElement) => {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.life += deltaTime;

    // Apply gravity and air resistance
    particle.vy += 0.01 * deltaTime;
    particle.vx *= 0.999;
    particle.vy *= 0.999;

    // Fade out as particle ages
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = Math.max(0, 1 - lifeRatio);

    // Remove particles that are off-screen or too old
    return (
      particle.life < particle.maxLife &&
      particle.x > -50 &&
      particle.x < canvas.width + 50 &&
      particle.y > -50 &&
      particle.y < canvas.height + 50
    );
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    
    // Create glow effect
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core particle
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const isAlive = updateParticle(particle, deltaTime * 0.1, canvas);
      if (isAlive) {
        drawParticle(ctx, particle);
      }
      return isAlive;
    });

    // Add new particles based on intensity
    const targetParticleCount = Math.floor(maxParticles * intensity);
    while (particlesRef.current.length < targetParticleCount) {
      particlesRef.current.push(createParticle(canvas));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [createParticle, updateParticle, drawParticle, intensity, maxParticles]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (intensity <= 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, intensity]);

  // Clear particles when intensity changes dramatically
  useEffect(() => {
    if (intensity < 0.1) {
      particlesRef.current = [];
    }
  }, [intensity]);

  return <ParticleCanvas ref={canvasRef} />;
};