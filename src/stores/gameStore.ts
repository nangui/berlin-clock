import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { 
  GameState, 
  GameMode, 
  Difficulty, 
  Challenge, 
  Achievement, 
  UserStats,
  DigitalTime,
  BerlinTime
} from '@/types';
import { convertDigitalToBerlin } from '@/utils/timeConverter';
import { generateChallenge } from '@/utils/challengeGenerator';
import { calculateScore } from '@/utils/scoring';

interface GameStore extends GameState {
  // Core game actions
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // Challenge actions
  generateNewChallenge: () => void;
  submitAnswer: (answer: DigitalTime | BerlinTime) => boolean;
  useHint: () => void;
  skipChallenge: () => void;
  
  // Score & progress actions
  updateScore: (points: number) => void;
  updateStreak: (correct: boolean) => void;
  levelUp: () => void;
  unlockAchievement: (achievementId: string) => void;
  
  // Settings actions
  setDifficulty: (difficulty: Difficulty) => void;
  setMode: (mode: GameMode) => void;
  
  // Time management
  tick: () => void;
  setTimeRemaining: (time: number) => void;
  
  // Stats
  userStats: UserStats;
  updateStats: (stats: Partial<UserStats>) => void;
}

const initialGameState: GameState = {
  mode: GameMode.PRACTICE,
  difficulty: Difficulty.BEGINNER,
  score: 0,
  level: 1,
  lives: 3,
  timeRemaining: 0,
  streak: 0,
  achievements: [],
  isPlaying: false,
  isPaused: false,
  currentChallenge: undefined
};

const initialUserStats: UserStats = {
  totalPlayTime: 0,
  gamesPlayed: 0,
  averageScore: 0,
  bestStreak: 0,
  fastestTime: 0,
  accuracyRate: 0,
  achievements: []
};

export const useGameStore = create<GameStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialGameState,
      userStats: initialUserStats,

      startGame: (mode: GameMode, difficulty: Difficulty) => {
        const challenge = generateChallenge(difficulty);
        set({
          mode,
          difficulty,
          isPlaying: true,
          isPaused: false,
          score: 0,
          streak: 0,
          lives: mode === GameMode.TIME_CHALLENGE ? 1 : 3,
          timeRemaining: mode === GameMode.TIME_CHALLENGE ? 300 : 0, // 5 minutes for time challenge
          currentChallenge: challenge,
          level: 1
        });
      },

      pauseGame: () => {
        set({ isPaused: true });
      },

      resumeGame: () => {
        set({ isPaused: false });
      },

      endGame: () => {
        const state = get();
        const stats = state.userStats;
        
        set({
          isPlaying: false,
          isPaused: false,
          userStats: {
            ...stats,
            gamesPlayed: stats.gamesPlayed + 1,
            averageScore: (stats.averageScore * stats.gamesPlayed + state.score) / (stats.gamesPlayed + 1),
            bestStreak: Math.max(stats.bestStreak, state.streak)
          }
        });
      },

      resetGame: () => {
        set(initialGameState);
      },

      generateNewChallenge: () => {
        const { difficulty, level } = get();
        const challenge = generateChallenge(difficulty, level);
        set({ currentChallenge: challenge });
      },

      submitAnswer: (answer: DigitalTime | BerlinTime): boolean => {
        const state = get();
        if (!state.currentChallenge) return false;

        const isCorrect = validateAnswer(answer, state.currentChallenge);
        const points = isCorrect ? calculateScore(state.difficulty, state.timeRemaining, state.streak) : 0;
        
        if (isCorrect) {
          set((state) => ({
            score: state.score + points,
            streak: state.streak + 1
          }));
          
          // Check for level up
          if (state.streak > 0 && state.streak % 10 === 0) {
            get().levelUp();
          }
        } else {
          set((state) => ({
            streak: 0,
            lives: Math.max(0, state.lives - 1)
          }));
          
          // Check for game over
          if (get().lives <= 0) {
            get().endGame();
          }
        }
        
        // Generate next challenge
        setTimeout(() => {
          get().generateNewChallenge();
        }, 1500);
        
        return isCorrect;
      },

      useHint: () => {
        // Implement hint logic - reduce score but show hint
        set((state) => ({
          score: Math.max(0, state.score - 50)
        }));
      },

      skipChallenge: () => {
        set((state) => ({
          lives: Math.max(0, state.lives - 1),
          streak: 0
        }));
        get().generateNewChallenge();
      },

      updateScore: (points: number) => {
        set((state) => ({
          score: state.score + points
        }));
      },

      updateStreak: (correct: boolean) => {
        set((state) => ({
          streak: correct ? state.streak + 1 : 0
        }));
      },

      levelUp: () => {
        set((state) => ({
          level: state.level + 1,
          lives: Math.min(5, state.lives + 1) // Bonus life on level up
        }));
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        if (state.achievements.find(a => a.id === achievementId)) return;
        
        // Achievement logic would be implemented here
        // For now, just add to list
        set((state) => ({
          achievements: [...state.achievements, createAchievement(achievementId)]
        }));
      },

      setDifficulty: (difficulty: Difficulty) => {
        set({ difficulty });
      },

      setMode: (mode: GameMode) => {
        set({ mode });
      },

      tick: () => {
        const state = get();
        if (!state.isPlaying || state.isPaused) return;
        
        if (state.mode === GameMode.TIME_CHALLENGE && state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 });
          
          if (state.timeRemaining <= 1) {
            get().endGame();
          }
        }
      },

      setTimeRemaining: (time: number) => {
        set({ timeRemaining: time });
      },

      updateStats: (stats: Partial<UserStats>) => {
        set((state) => ({
          userStats: { ...state.userStats, ...stats }
        }));
      }
    })),
    { name: 'berlin-clock-game' }
  )
);

// Helper functions
function validateAnswer(answer: DigitalTime | BerlinTime, challenge: Challenge): boolean {
  // Convert challenge target to both formats and compare
  const targetBerlin = convertDigitalToBerlin(challenge.targetTime);
  const targetDigital = challenge.targetTime;
  
  if ('hours' in answer) {
    // Digital time answer
    return answer.hours === targetDigital.hours && 
           answer.minutes === targetDigital.minutes &&
           answer.seconds === targetDigital.seconds;
  } else {
    // Berlin time answer
    return JSON.stringify(answer) === JSON.stringify(targetBerlin);
  }
}

function createAchievement(id: string): Achievement {
  // This would normally come from a achievements configuration
  return {
    id,
    name: `Achievement ${id}`,
    description: 'Achievement description',
    icon: '🏆',
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date()
  };
}