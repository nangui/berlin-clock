import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ClockProps, LampState, LampColor, AnimationState } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';
import { Lamp } from './Lamp';
import { ClockBackground } from './ClockBackground';
import { ParticleSystem } from './ParticleSystem';

const ClockContainer = styled(motion.div)<{ $isDarkMode: boolean; $glassOpacity: number }>`
  position: relative;
  padding: 2rem;
  border-radius: 24px;
  background: ${({ $isDarkMode, $glassOpacity }) =>
    $isDarkMode
      ? `rgba(255, 255, 255, ${$glassOpacity})`
      : `rgba(0, 0, 0, ${$glassOpacity})`};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 24px;
    pointer-events: none;
  }
`;

const ClockGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  position: relative;
  z-index: 10;
`;

const ClockRow = styled(motion.div)<{ $isMinutesRow?: boolean }>`
  display: flex;
  gap: ${({ $isMinutesRow }) => ($isMinutesRow ? '0.75rem' : '1rem')};
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  position: relative;
`;

const RowLabel = styled(motion.div)<{ $isDarkMode: boolean }>`
  position: absolute;
  left: -2.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $isDarkMode }) => ($isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)')};
  writing-mode: vertical-rl;
  text-orientation: mixed;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    position: static;
    writing-mode: initial;
    text-orientation: initial;
    transform: none;
    margin-bottom: 0.5rem;
    opacity: 1;
  }
`;

const TimeDisplay = styled(motion.div)<{ $isDarkMode: boolean }>`
  position: absolute;
  top: -3rem;
  right: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ClockTitle = styled(motion.h2)<{ $isDarkMode: boolean }>`
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const SecondsIndicator = styled(motion.div)<{ $isActive: boolean; $isDarkMode: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${({ $isActive, $isDarkMode }) =>
    $isActive
      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
      : $isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  border: 2px solid ${({ $isActive }) => ($isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)')};
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? '0 8px 24px rgba(245, 158, 11, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ $isActive }) =>
    $isActive &&
    css`
      animation: ${pulseAnimation} 2s infinite;
    `}
  
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};
  }
  
  &::after {
    content: 'S';
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ $isActive, $isDarkMode }) =>
      $isActive ? '#fff' : $isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    position: relative;
    z-index: 1;
  }
`;

interface BerlinClockProps extends ClockProps {
  showLabels?: boolean;
  showDigitalTime?: boolean;
  animated?: boolean;
}

export const BerlinClock: React.FC<BerlinClockProps> = ({
  time,
  berlinTime,
  interactive = false,
  showLabels = false,
  showDigitalTime = true,
  animated = true,
  size = 'medium',
  theme,
  onLampClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme: settingsTheme, game } = useSettingsStore();
  const currentTheme = theme || settingsTheme;
  
  const lampSize = {
    small: 32,
    medium: 48,
    large: 64
  }[size];

  useEffect(() => {
    if (!animated || !containerRef.current || game.accessibility.reduceMotion) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(containerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

      // Floating animation
      gsap.to(containerRef.current, {
        y: -10,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animated, game.accessibility.reduceMotion]);

  const createLampState = (isActive: boolean, color: LampColor): LampState => ({
    id: Math.random().toString(36),
    isActive,
    color,
    intensity: isActive ? 1 : 0,
    animationState: isActive ? AnimationState.ACTIVE : AnimationState.IDLE
  });

  const formatTime = () => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ClockContainer
      ref={containerRef}
      $isDarkMode={currentTheme.isDarkMode}
      $glassOpacity={currentTheme.glassOpacity}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'backOut' }}
    >
      <ClockBackground theme={currentTheme} />
      
      {game.particleEffects && <ParticleSystem intensity={currentTheme.particleIntensity} />}
      
      <ClockTitle $isDarkMode={currentTheme.isDarkMode}>
        Berlin Clock
      </ClockTitle>
      
      {showDigitalTime && (
        <TimeDisplay 
          $isDarkMode={currentTheme.isDarkMode}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {formatTime()}
        </TimeDisplay>
      )}

      <ClockGrid>
        {/* Seconds Row */}
        <ClockRow
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {showLabels && (
            <RowLabel $isDarkMode={currentTheme.isDarkMode}>Seconds</RowLabel>
          )}
          <SecondsIndicator
            $isActive={berlinTime.seconds}
            $isDarkMode={currentTheme.isDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        </ClockRow>

        {/* Hours 5 Row */}
        <ClockRow
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {showLabels && (
            <RowLabel $isDarkMode={currentTheme.isDarkMode}>5 Hours</RowLabel>
          )}
          {berlinTime.hours5.map((isActive, index) => (
            <Lamp
              key={`hours5-${index}`}
              state={createLampState(isActive, LampColor.RED)}
              position={{ row: 1, col: index }}
              size={lampSize}
              onClick={() => interactive && onLampClick?.(`hours5-${index}`)}
              disabled={!interactive}
              aria-label={`5-hour block ${index + 1}, ${isActive ? 'active' : 'inactive'}`}
            />
          ))}
        </ClockRow>

        {/* Hours 1 Row */}
        <ClockRow
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {showLabels && (
            <RowLabel $isDarkMode={currentTheme.isDarkMode}>1 Hour</RowLabel>
          )}
          {berlinTime.hours1.map((isActive, index) => (
            <Lamp
              key={`hours1-${index}`}
              state={createLampState(isActive, LampColor.RED)}
              position={{ row: 2, col: index }}
              size={lampSize}
              onClick={() => interactive && onLampClick?.(`hours1-${index}`)}
              disabled={!interactive}
              aria-label={`1-hour block ${index + 1}, ${isActive ? 'active' : 'inactive'}`}
            />
          ))}
        </ClockRow>

        {/* Minutes 5 Row */}
        <ClockRow
          $isMinutesRow
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {showLabels && (
            <RowLabel $isDarkMode={currentTheme.isDarkMode}>5 Minutes</RowLabel>
          )}
          {berlinTime.minutes5.map((isActive, index) => {
            // Quarter hour markers (positions 2, 5, 8) are red, others are yellow
            const isQuarterMarker = [2, 5, 8].includes(index);
            return (
              <Lamp
                key={`minutes5-${index}`}
                state={createLampState(isActive, isQuarterMarker ? LampColor.RED : LampColor.YELLOW)}
                position={{ row: 3, col: index }}
                size={lampSize * 0.8} // Slightly smaller for minutes
                onClick={() => interactive && onLampClick?.(`minutes5-${index}`)}
                disabled={!interactive}
                aria-label={`5-minute block ${index + 1}, ${isActive ? 'active' : 'inactive'}${isQuarterMarker ? ', quarter marker' : ''}`}
              />
            );
          })}
        </ClockRow>

        {/* Minutes 1 Row */}
        <ClockRow
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {showLabels && (
            <RowLabel $isDarkMode={currentTheme.isDarkMode}>1 Minute</RowLabel>
          )}
          {berlinTime.minutes1.map((isActive, index) => (
            <Lamp
              key={`minutes1-${index}`}
              state={createLampState(isActive, LampColor.YELLOW)}
              position={{ row: 4, col: index }}
              size={lampSize}
              onClick={() => interactive && onLampClick?.(`minutes1-${index}`)}
              disabled={!interactive}
              aria-label={`1-minute block ${index + 1}, ${isActive ? 'active' : 'inactive'}`}
            />
          ))}
        </ClockRow>
      </ClockGrid>
    </ClockContainer>
  );
};