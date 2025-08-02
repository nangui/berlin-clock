// Core game types
export interface BerlinTime {
  seconds: boolean;
  hours5: boolean[];
  hours1: boolean[];
  minutes5: boolean[];
  minutes1: boolean[];
}

export interface DigitalTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  level: number;
  lives: number;
  timeRemaining: number;
  streak: number;
  achievements: Achievement[];
  isPlaying: boolean;
  isPaused: boolean;
  currentChallenge?: Challenge;
}

export enum GameMode {
  TUTORIAL = 'tutorial',
  PRACTICE = 'practice',
  TIME_CHALLENGE = 'time_challenge',
  MEMORY_GAME = 'memory_game',
  SPEED_READING = 'speed_reading',
  COMPETITIVE = 'competitive'
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  targetTime: DigitalTime;
  timeLimit: number;
  points: number;
  hint?: string;
}

export enum ChallengeType {
  READ_TIME = 'read_time',
  SET_TIME = 'set_time',
  QUICK_MATCH = 'quick_match',
  MEMORY_FLASH = 'memory_flash'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  totalPlayTime: number;
  gamesPlayed: number;
  averageScore: number;
  bestStreak: number;
  fastestTime: number;
  accuracyRate: number;
  achievements: Achievement[];
}

export interface ThemeSettings {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  backgroundGradient: string[];
  glassOpacity: number;
  particleIntensity: number;
}

export interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enableHaptics: boolean;
  soundpack: string;
}

export interface GameSettings {
  showHints: boolean;
  autoAdvance: boolean;
  animationSpeed: number;
  particleEffects: boolean;
  accessibility: AccessibilitySettings;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  fontSize: number;
  colorBlindMode: ColorBlindMode;
}

export enum ColorBlindMode {
  NONE = 'none',
  PROTANOPIA = 'protanopia',
  DEUTERANOPIA = 'deuteranopia',
  TRITANOPIA = 'tritanopia'
}

export interface LampState {
  id: string;
  isActive: boolean;
  color: LampColor;
  intensity: number;
  animationState: AnimationState;
}

export enum LampColor {
  RED = 'red',
  YELLOW = 'yellow',
  OFF = 'off'
}

export enum AnimationState {
  IDLE = 'idle',
  ACTIVATING = 'activating',
  ACTIVE = 'active',
  DEACTIVATING = 'deactivating',
  PULSING = 'pulsing',
  ERROR = 'error'
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

export interface GameAnalytics {
  sessionId: string;
  startTime: Date;
  events: AnalyticsEvent[];
}

export interface AnalyticsEvent {
  type: string;
  timestamp: Date;
  data: Record<string, any>;
}

// Component prop types
export interface ClockProps {
  time: DigitalTime;
  berlinTime: BerlinTime;
  interactive?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: ThemeSettings;
  onLampClick?: (lampId: string) => void;
}

export interface LampProps {
  state: LampState;
  position: { row: number; col: number };
  size: number;
  onClick?: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}