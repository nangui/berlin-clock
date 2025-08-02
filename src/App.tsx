import { useEffect, useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settingsStore';
import { useGameStore } from '@/stores/gameStore';
import { BerlinClock } from '@/components/BerlinClock/BerlinClock';
import { GameModeSelector } from '@/components/Game/GameModeSelector';
import { convertDigitalToBerlin, getCurrentTime } from '@/utils/timeConverter';
import { GameMode, Difficulty, DigitalTime } from '@/types';

const GlobalStyle = createGlobalStyle<{ $theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: ${({ $theme }) => $theme.game.accessibility.fontSize}px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: ${({ $theme }) => 
      $theme.theme.isDarkMode 
        ? `linear-gradient(135deg, ${$theme.theme.backgroundGradient.join(', ')})`
        : 'linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)'
    };
    color: ${({ $theme }) => ($theme.theme.isDarkMode ? '#ffffff' : '#000000')};
    min-height: 100vh;
    overflow-x: hidden;
    
    ${({ $theme }) => $theme.game.accessibility.reduceMotion && `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `}
  }

  button {
    font-family: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ $theme }) => ($theme.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ $theme }) => $theme.theme.accentColor};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ $theme }) => $theme.theme.primaryColor};
  }

  /* High contrast mode */
  ${({ $theme }) => $theme.game.accessibility.highContrast && `
    * {
      filter: contrast(150%) saturate(200%);
    }
  `}
`;

const AppContainer = styled.div<{ $isDarkMode: boolean }>`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div<{ $isDarkMode: boolean }>`
  position: fixed;
  inset: 0;
  opacity: 0.1;
  background-image: radial-gradient(circle at 2px 2px, ${({ $isDarkMode }) => $isDarkMode ? 'white' : 'black'} 1px, transparent 0);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: -1;
`;

const MainContent = styled(motion.main)`
  position: relative;
  z-index: 1;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled(motion.header)<{ $isDarkMode: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  backdrop-filter: blur(20px);
  background: ${({ $isDarkMode }) => 
    $isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.3)'
  };
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.h1)<{ $isDarkMode: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const HeaderButton = styled(motion.button)<{ $isDarkMode: boolean; $accentColor: string }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${({ $isDarkMode }) => 
    $isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  };
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: ${({ $accentColor }) => $accentColor};
    color: white;
    transform: translateY(-2px);
  }
`;

const GameView = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 6rem; /* Account for fixed header */
`;

const ClockView = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-top: 6rem;
`;

const LiveTimeDisplay = styled(motion.div)<{ $isDarkMode: boolean }>`
  text-align: center;
  margin-bottom: 2rem;
`;

const LiveTimeTitle = styled.h2<{ $isDarkMode: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const LiveDigitalTime = styled.div<{ $isDarkMode: boolean }>`
  font-size: 3rem;
  font-weight: 300;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#000')};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
`;

const ControlPanel = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

enum AppView {
  MENU = 'menu',
  LIVE_CLOCK = 'live_clock',
  GAME = 'game'
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MENU);
  const [currentTime, setCurrentTime] = useState<DigitalTime>(getCurrentTime());
  
  const { theme, game } = useSettingsStore();
  const { startGame, isPlaying, mode } = useGameStore();

  // Update live clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleModeSelect = (selectedMode: GameMode, difficulty: Difficulty) => {
    startGame(selectedMode, difficulty);
    setCurrentView(AppView.GAME);
  };

  const handleBackToMenu = () => {
    setCurrentView(AppView.MENU);
  };

  const handleShowLiveClock = () => {
    setCurrentView(AppView.LIVE_CLOCK);
  };

  const berlinTime = convertDigitalToBerlin(currentTime);

  const viewVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <ThemeProvider theme={{ theme, game }}>
      <GlobalStyle $theme={{ theme, game }} />
      <AppContainer $isDarkMode={theme.isDarkMode}>
        <BackgroundPattern $isDarkMode={theme.isDarkMode} />
        
        <Header $isDarkMode={theme.isDarkMode}>
          <Logo
            $isDarkMode={theme.isDarkMode}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ⏰ Berlin Clock
          </Logo>
          
          <HeaderButtons>
            {currentView !== AppView.LIVE_CLOCK && (
              <HeaderButton
                $isDarkMode={theme.isDarkMode}
                $accentColor={theme.accentColor}
                onClick={handleShowLiveClock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Live Clock
              </HeaderButton>
            )}
            
            {currentView !== AppView.MENU && (
              <HeaderButton
                $isDarkMode={theme.isDarkMode}
                $accentColor={theme.accentColor}
                onClick={handleBackToMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Menu
              </HeaderButton>
            )}
            
            <HeaderButton
              $isDarkMode={theme.isDarkMode}
              $accentColor={theme.accentColor}
              onClick={() => {/* Settings modal would open here */}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚙️ Settings
            </HeaderButton>
          </HeaderButtons>
        </Header>

        <MainContent>
          <AnimatePresence mode="wait">
            {currentView === AppView.MENU && (
              <GameView
                key="menu"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <GameModeSelector onModeSelect={handleModeSelect} />
              </GameView>
            )}

            {currentView === AppView.LIVE_CLOCK && (
              <ClockView
                key="clock"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <LiveTimeDisplay $isDarkMode={theme.isDarkMode}>
                  <LiveTimeTitle $isDarkMode={theme.isDarkMode}>
                    Current Time
                  </LiveTimeTitle>
                  <LiveDigitalTime $isDarkMode={theme.isDarkMode}>
                    {currentTime.hours.toString().padStart(2, '0')}:
                    {currentTime.minutes.toString().padStart(2, '0')}:
                    {currentTime.seconds.toString().padStart(2, '0')}
                  </LiveDigitalTime>
                </LiveTimeDisplay>

                <BerlinClock
                  time={currentTime}
                  berlinTime={berlinTime}
                  showLabels={true}
                  showDigitalTime={false}
                  size="large"
                />

                <ControlPanel>
                  <HeaderButton
                    $isDarkMode={theme.isDarkMode}
                    $accentColor={theme.accentColor}
                    onClick={() => handleModeSelect(GameMode.PRACTICE, Difficulty.BEGINNER)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🎯 Practice with this time
                  </HeaderButton>
                </ControlPanel>
              </ClockView>
            )}

            {currentView === AppView.GAME && isPlaying && (
              <GameView
                key="game"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                {/* Game components would be rendered here based on the selected mode */}
                <div style={{ textAlign: 'center', color: theme.isDarkMode ? 'white' : 'black' }}>
                  <h2>Game Mode: {mode}</h2>
                  <p>Game implementation coming soon!</p>
                  <BerlinClock
                    time={currentTime}
                    berlinTime={berlinTime}
                    interactive={true}
                    showLabels={false}
                    size="medium"
                  />
                </div>
              </GameView>
            )}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;