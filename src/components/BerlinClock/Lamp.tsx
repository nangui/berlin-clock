import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { LampProps, LampColor, AnimationState } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';

const glowAnimation = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px currentColor,
      0 0 40px currentColor,
      0 0 60px currentColor,
      inset 0 2px 8px rgba(255, 255, 255, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 30px currentColor,
      0 0 60px currentColor,
      0 0 90px currentColor,
      inset 0 2px 8px rgba(255, 255, 255, 0.3);
  }
`;

const LampContainer = styled(motion.button)<{
  $isActive: boolean;
  $color: LampColor;
  $size: number;
  $disabled: boolean;
  $animationSpeed: number;
  $highContrast: boolean;
}>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  transform-style: preserve-3d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${({ $isActive, $color, $highContrast }) => {
    if (!$isActive) return $highContrast ? '#333' : 'rgba(255, 255, 255, 0.1)';
    
    switch ($color) {
      case LampColor.RED:
        return $highContrast ? '#ff0000' : 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)';
      case LampColor.YELLOW:
        return $highContrast ? '#ffff00' : 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)';
      default:
        return $highContrast ? '#666' : 'rgba(255, 255, 255, 0.1)';
    }
  }};
  
  border: 2px solid ${({ $isActive, $color, $highContrast }) => {
    if (!$isActive) return 'rgba(255, 255, 255, 0.2)';
    
    switch ($color) {
      case LampColor.RED:
        return $highContrast ? '#ff0000' : '#ef4444';
      case LampColor.YELLOW:
        return $highContrast ? '#ffff00' : '#f59e0b';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  
  color: ${({ $isActive, $color }) => {
    if (!$isActive) return 'transparent';
    
    switch ($color) {
      case LampColor.RED:
        return '#ef4444';
      case LampColor.YELLOW:
        return '#f59e0b';
      default:
        return 'transparent';
    }
  }};
  
  box-shadow: ${({ $isActive, $highContrast }) => {
    if (!$isActive) return '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    return $highContrast
      ? '0 0 20px currentColor, 0 8px 24px rgba(0, 0, 0, 0.3)'
      : `
        0 0 20px currentColor,
        0 0 40px currentColor,
        0 8px 24px rgba(0, 0, 0, 0.3),
        inset 0 2px 8px rgba(255, 255, 255, 0.3)
      `;
  }};
  
  ${({ $isActive, $animationSpeed }) =>
    $isActive &&
    css`
      animation: ${glowAnimation} ${2 / $animationSpeed}s infinite ease-in-out;
    `}
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    filter: brightness(1.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }
  
  &:focus-visible {
    outline: 3px solid #6366f1;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.7;
  }
`;

const LampInner = styled.div<{ $isActive: boolean; $color: LampColor }>`
  position: absolute;
  inset: 6px;
  border-radius: 8px;
  background: ${({ $isActive, $color }) => {
    if (!$isActive) return 'rgba(255, 255, 255, 0.05)';
    
    switch ($color) {
      case LampColor.RED:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))';
      case LampColor.YELLOW:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  transition: all 0.3s ease;
`;

const LampReflection = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  height: 40%;
  border-radius: 6px 6px 12px 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, ${({ $isActive }) => ($isActive ? 0.4 : 0.1)}) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  transition: all 0.3s ease;
`;

const LampIcon = styled.div<{ $isActive: boolean; $color: LampColor }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $isActive, $color }) => {
    if (!$isActive) return 'rgba(255, 255, 255, 0.3)';
    
    switch ($color) {
      case LampColor.RED:
        return '#fff';
      case LampColor.YELLOW:
        return '#fff';
      default:
        return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  pointer-events: none;
`;

const ParticleContainer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  overflow: hidden;
  pointer-events: none;
`;

export const Lamp: React.FC<LampProps> = ({
  state,
  position: _position,
  size,
  onClick,
  disabled = false,
  'aria-label': ariaLabel
}) => {
  const lampRef = useRef<HTMLButtonElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const { game, sound } = useSettingsStore();
  
  useEffect(() => {
    if (!lampRef.current || game.accessibility.reduceMotion) return;

    const ctx = gsap.context(() => {
      if (state.animationState === AnimationState.ACTIVATING) {
        gsap.fromTo(
          lampRef.current,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      } else if (state.animationState === AnimationState.DEACTIVATING) {
        gsap.to(lampRef.current, {
          scale: 0.9,
          opacity: 0.7,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }, lampRef);

    return () => ctx.revert();
  }, [state.animationState, game.accessibility.reduceMotion]);

  useEffect(() => {
    if (!state.isActive || !particleRef.current || !game.particleEffects) return;

    const particles: HTMLElement[] = [];
    const particleCount = 6;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
      `;
      particleRef.current.appendChild(particle);
      particles.push(particle);

      gsap.set(particle, {
        x: size / 2,
        y: size / 2,
        scale: 0
      });

      gsap.to(particle, {
        x: `random(${-size / 4}, ${size / 4})`,
        y: `random(${-size / 4}, ${size / 4})`,
        scale: 'random(0.5, 1.5)',
        opacity: 'random(0.3, 0.8)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: `random(0, 2)`
      });
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [state.isActive, size, game.particleEffects]);

  const handleClick = () => {
    if (disabled) return;
    
    // Haptic feedback
    if (sound.enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Sound effect would be triggered here
    
    onClick?.();
  };

  const getColorIcon = () => {
    switch (state.color) {
      case LampColor.RED:
        return '●';
      case LampColor.YELLOW:
        return '●';
      default:
        return '○';
    }
  };

  const variants = {
    inactive: {
      scale: 1,
      rotateX: 0,
      rotateY: 0
    },
    active: {
      scale: 1.02,
      rotateX: -5,
      rotateY: 5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      rotateX: -2,
      rotateY: 2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <LampContainer
      ref={lampRef}
      $isActive={state.isActive}
      $color={state.color}
      $size={size}
      $disabled={disabled}
      $animationSpeed={game.animationSpeed}
      $highContrast={game.accessibility.highContrast}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={state.isActive}
      role="switch"
      variants={variants}
      initial="inactive"
      animate={state.isActive ? 'active' : 'inactive'}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
    >
      <LampInner $isActive={state.isActive} $color={state.color} />
      <LampReflection $isActive={state.isActive} />
      <LampIcon $isActive={state.isActive} $color={state.color}>
        {getColorIcon()}
      </LampIcon>
      
      {game.particleEffects && (
        <ParticleContainer ref={particleRef} />
      )}
    </LampContainer>
  );
};