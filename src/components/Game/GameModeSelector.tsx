import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GameMode, Difficulty } from '@/types';

import { useSettingsStore } from '@/stores/settingsStore';

const SelectorContainer = styled(motion.div)<{ $isDarkMode: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ModeCard = styled(motion.button)<{ 
  $isDarkMode: boolean; 
  $isSelected: boolean; 
  $accentColor: string; 
}>`
  position: relative;
  padding: 2rem;
  border: none;
  border-radius: 20px;
  background: ${({ $isDarkMode, $isSelected, $accentColor }) =>
    $isSelected
      ? `linear-gradient(135deg, ${$accentColor}20, ${$accentColor}10)`
      : $isDarkMode
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)'};
  border: 2px solid ${({ $isSelected, $accentColor }) =>
    $isSelected ? $accentColor : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${({ $accentColor }) => $accentColor};
  }
  
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
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const ModeIcon = styled.div<{ $accentColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${({ $accentColor }) => $accentColor}, ${({ $accentColor }) => $accentColor}80);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const ModeTitle = styled.h3<{ $isDarkMode: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
`;

const ModeDescription = styled.p<{ $isDarkMode: boolean }>`
  font-size: 1rem;
  color: ${({ $isDarkMode }) => ($isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)')};
  margin: 0 0 1rem 0;
  line-height: 1.5;
  position: relative;
  z-index: 1;
`;

const ModeFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

const FeatureTag = styled.span<{ $isDarkMode: boolean; $accentColor: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $accentColor }) => $accentColor}20;
  color: ${({ $accentColor }) => $accentColor};
  border: 1px solid ${({ $accentColor }) => $accentColor}40;
`;

const DifficultySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const DifficultyButton = styled(motion.button)<{
  $isDarkMode: boolean;
  $isSelected: boolean;
  $accentColor: string;
}>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ $isSelected, $accentColor, $isDarkMode }) =>
    $isSelected
      ? $accentColor
      : $isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  color: ${({ $isSelected, $isDarkMode }) =>
    $isSelected ? '#fff' : $isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
  border: 1px solid ${({ $isSelected, $accentColor }) =>
    $isSelected ? $accentColor : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $accentColor }) => $accentColor}40;
  }
`;

const StartButton = styled(motion.button)<{ $accentColor: string }>`
  width: 100%;
  padding: 1rem 2rem;
  margin-top: 2rem;
  border: none;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, ${({ $accentColor }) => $accentColor}, ${({ $accentColor }) => $accentColor}80);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, difficulty: Difficulty) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onModeSelect }) => {
  const [selectedMode, setSelectedMode] = React.useState<GameMode>(GameMode.PRACTICE);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>(Difficulty.BEGINNER);
  
  const { theme } = useSettingsStore();

  const gameModes = [
    {
      mode: GameMode.TUTORIAL,
      icon: '🎓',
      title: 'Tutorial',
      description: 'Learn the Berlin Clock step by step with guided lessons.',
      features: ['Step-by-step guide', 'Interactive learning', 'Progress tracking'],
      difficulties: [Difficulty.BEGINNER]
    },
    {
      mode: GameMode.PRACTICE,
      icon: '🎯',
      title: 'Practice Mode',
      description: 'Perfect your skills with unlimited time and hints.',
      features: ['No time pressure', 'Hint system', 'Detailed feedback'],
      difficulties: [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED]
    },
    {
      mode: GameMode.TIME_CHALLENGE,
      icon: '⚡',
      title: 'Time Challenge',
      description: 'Race against time to solve as many challenges as possible.',
      features: ['Time pressure', 'Score multipliers', 'Leaderboards'],
      difficulties: [Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.EXPERT]
    },
    {
      mode: GameMode.MEMORY_GAME,
      icon: '🧠',
      title: 'Memory Game',
      description: 'Test your memory with quick time flashes.',
      features: ['Flash memory', 'Cognitive training', 'Progressive difficulty'],
      difficulties: [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.EXPERT]
    },
    {
      mode: GameMode.SPEED_READING,
      icon: '🏃',
      title: 'Speed Reading',
      description: 'How fast can you read the Berlin Clock?',
      features: ['Speed focus', 'Reaction time', 'Accuracy tracking'],
      difficulties: [Difficulty.ADVANCED, Difficulty.EXPERT]
    },
    {
      mode: GameMode.COMPETITIVE,
      icon: '🏆',
      title: 'Competitive',
      description: 'Challenge other players in real-time matches.',
      features: ['Multiplayer', 'Rankings', 'Tournaments'],
      difficulties: [Difficulty.EXPERT]
    }
  ];

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 'Beginner';
      case Difficulty.INTERMEDIATE:
        return 'Intermediate';
      case Difficulty.ADVANCED:
        return 'Advanced';
      case Difficulty.EXPERT:
        return 'Expert';
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    const modeConfig = gameModes.find(m => m.mode === mode);
    if (modeConfig && !modeConfig.difficulties.includes(selectedDifficulty)) {
      setSelectedDifficulty(modeConfig.difficulties[0]);
    }
  };

  const handleStartGame = () => {
    onModeSelect(selectedMode, selectedDifficulty);
  };

  const selectedModeConfig = gameModes.find(m => m.mode === selectedMode);

  return (
    <SelectorContainer
      $isDarkMode={theme.isDarkMode}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {gameModes.map((modeConfig, index) => (
        <ModeCard
          key={modeConfig.mode}
          $isDarkMode={theme.isDarkMode}
          $isSelected={selectedMode === modeConfig.mode}
          $accentColor={theme.accentColor}
          onClick={() => handleModeSelect(modeConfig.mode)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ModeIcon $accentColor={theme.accentColor}>
            {modeConfig.icon}
          </ModeIcon>
          
          <ModeTitle $isDarkMode={theme.isDarkMode}>
            {modeConfig.title}
          </ModeTitle>
          
          <ModeDescription $isDarkMode={theme.isDarkMode}>
            {modeConfig.description}
          </ModeDescription>
          
          <ModeFeatures>
            {modeConfig.features.map((feature, idx) => (
              <FeatureTag
                key={idx}
                $isDarkMode={theme.isDarkMode}
                $accentColor={theme.accentColor}
              >
                {feature}
              </FeatureTag>
            ))}
          </ModeFeatures>
          
          {selectedMode === modeConfig.mode && (
            <DifficultySelector>
              {modeConfig.difficulties.map((difficulty) => (
                <DifficultyButton
                  key={difficulty}
                  $isDarkMode={theme.isDarkMode}
                  $isSelected={selectedDifficulty === difficulty}
                  $accentColor={theme.accentColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDifficulty(difficulty);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getDifficultyLabel(difficulty)}
                </DifficultyButton>
              ))}
            </DifficultySelector>
          )}
        </ModeCard>
      ))}
      
      {selectedModeConfig && (
        <StartButton
          $accentColor={theme.accentColor}
          onClick={handleStartGame}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ gridColumn: '1 / -1' }}
        >
          Start {selectedModeConfig.title} - {getDifficultyLabel(selectedDifficulty)}
        </StartButton>
      )}
    </SelectorContainer>
  );
};