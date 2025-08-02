import { Challenge, ChallengeType, Difficulty, DigitalTime } from '@/types';
import { generateTimeForDifficulty, generateRandomTime } from './timeConverter';

/**
 * Generate a challenge based on difficulty and level
 */
export function generateChallenge(difficulty: Difficulty, level: number = 1): Challenge {
  const challengeTypes = getChallengeTypesForDifficulty(difficulty);
  const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
  
  const baseTimeLimit = getBaseTimeLimit(difficulty, type);
  const timeLimit = Math.max(5, baseTimeLimit - Math.floor(level / 5) * 2); // Reduce time as level increases
  
  const targetTime = generateTimeForDifficulty(difficulty);
  const points = calculateChallengePoints(difficulty, type, level);
  
  return {
    id: generateChallengeId(),
    type,
    targetTime,
    timeLimit,
    points,
    hint: generateHint(type, targetTime, difficulty)
  };
}

/**
 * Get available challenge types for a difficulty level
 */
function getChallengeTypesForDifficulty(difficulty: Difficulty): ChallengeType[] {
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return [ChallengeType.READ_TIME, ChallengeType.SET_TIME];
    case Difficulty.INTERMEDIATE:
      return [ChallengeType.READ_TIME, ChallengeType.SET_TIME, ChallengeType.QUICK_MATCH];
    case Difficulty.ADVANCED:
      return [ChallengeType.READ_TIME, ChallengeType.SET_TIME, ChallengeType.QUICK_MATCH, ChallengeType.MEMORY_FLASH];
    case Difficulty.EXPERT:
      return Object.values(ChallengeType);
    default:
      return [ChallengeType.READ_TIME];
  }
}

/**
 * Get base time limit for challenge type and difficulty
 */
function getBaseTimeLimit(difficulty: Difficulty, type: ChallengeType): number {
  const baseTimes = {
    [ChallengeType.READ_TIME]: {
      [Difficulty.BEGINNER]: 45,
      [Difficulty.INTERMEDIATE]: 30,
      [Difficulty.ADVANCED]: 20,
      [Difficulty.EXPERT]: 15
    },
    [ChallengeType.SET_TIME]: {
      [Difficulty.BEGINNER]: 60,
      [Difficulty.INTERMEDIATE]: 45,
      [Difficulty.ADVANCED]: 30,
      [Difficulty.EXPERT]: 20
    },
    [ChallengeType.QUICK_MATCH]: {
      [Difficulty.BEGINNER]: 30,
      [Difficulty.INTERMEDIATE]: 20,
      [Difficulty.ADVANCED]: 15,
      [Difficulty.EXPERT]: 10
    },
    [ChallengeType.MEMORY_FLASH]: {
      [Difficulty.BEGINNER]: 60,
      [Difficulty.INTERMEDIATE]: 45,
      [Difficulty.ADVANCED]: 30,
      [Difficulty.EXPERT]: 20
    }
  };
  
  return baseTimes[type][difficulty];
}

/**
 * Calculate points for a challenge based on difficulty, type, and level
 */
function calculateChallengePoints(difficulty: Difficulty, type: ChallengeType, level: number): number {
  const basePoints = {
    [Difficulty.BEGINNER]: 100,
    [Difficulty.INTERMEDIATE]: 200,
    [Difficulty.ADVANCED]: 300,
    [Difficulty.EXPERT]: 500
  };
  
  const typeMultiplier = {
    [ChallengeType.READ_TIME]: 1.0,
    [ChallengeType.SET_TIME]: 1.2,
    [ChallengeType.QUICK_MATCH]: 1.5,
    [ChallengeType.MEMORY_FLASH]: 2.0
  };
  
  const levelBonus = Math.floor(level / 5) * 50;
  
  return Math.round(basePoints[difficulty] * typeMultiplier[type] + levelBonus);
}

/**
 * Generate a hint for a challenge
 */
function generateHint(type: ChallengeType, targetTime: DigitalTime, difficulty: Difficulty): string {
  switch (type) {
    case ChallengeType.READ_TIME:
      if (difficulty === Difficulty.BEGINNER) {
        return `Remember: Top row = 5-hour blocks, second row = 1-hour blocks. Hours = ${Math.floor(targetTime.hours / 5)} × 5 + ${targetTime.hours % 5}`;
      }
      return `Count the lit lamps: hours (${targetTime.hours}), minutes (${targetTime.minutes})`;
      
    case ChallengeType.SET_TIME:
      if (difficulty === Difficulty.BEGINNER) {
        return `Set ${targetTime.hours}:${targetTime.minutes.toString().padStart(2, '0')}. Break it down: ${Math.floor(targetTime.hours / 5)} five-hour blocks, ${targetTime.hours % 5} one-hour blocks`;
      }
      return `Set the time by clicking the correct lamps for ${targetTime.hours}:${targetTime.minutes.toString().padStart(2, '0')}`;
      
    case ChallengeType.QUICK_MATCH:
      return `Match the Berlin time to the digital time as quickly as possible!`;
      
    case ChallengeType.MEMORY_FLASH:
      return `Remember the time pattern that was just shown!`;
      
    default:
      return `Use the Berlin Clock pattern to solve this challenge!`;
  }
}

/**
 * Generate unique challenge ID
 */
function generateChallengeId(): string {
  return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate multiple challenges for a session
 */
export function generateChallengeSession(difficulty: Difficulty, count: number = 10, startLevel: number = 1): Challenge[] {
  const challenges: Challenge[] = [];
  
  for (let i = 0; i < count; i++) {
    const level = startLevel + Math.floor(i / 3); // Level up every 3 challenges
    challenges.push(generateChallenge(difficulty, level));
  }
  
  return challenges;
}

/**
 * Generate a timed challenge with specific constraints
 */
export function generateTimedChallenge(difficulty: Difficulty, timeLimit: number): Challenge {
  const challengeTypes = getChallengeTypesForDifficulty(difficulty);
  const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
  
  // For timed challenges, use more complex times
  let targetTime: DigitalTime;
  
  if (difficulty === Difficulty.EXPERT) {
    targetTime = generateRandomTime();
  } else {
    targetTime = generateTimeForDifficulty(difficulty);
  }
  
  return {
    id: generateChallengeId(),
    type,
    targetTime,
    timeLimit,
    points: Math.round(calculateChallengePoints(difficulty, type, 1) * (60 / timeLimit)), // Bonus for shorter time
    hint: generateHint(type, targetTime, difficulty)
  };
}

/**
 * Generate memory challenge with flash duration
 */
export function generateMemoryChallenge(difficulty: Difficulty, flashDuration: number = 3): Challenge {
  const targetTime = generateTimeForDifficulty(difficulty);
  const timeLimit = getBaseTimeLimit(difficulty, ChallengeType.MEMORY_FLASH) - flashDuration;
  
  return {
    id: generateChallengeId(),
    type: ChallengeType.MEMORY_FLASH,
    targetTime,
    timeLimit,
    points: calculateChallengePoints(difficulty, ChallengeType.MEMORY_FLASH, 1) * 1.5, // Bonus for memory challenge
    hint: `The time was shown for ${flashDuration} seconds. What time was it?`
  };
}

/**
 * Generate tutorial challenges with progressive difficulty
 */
export function generateTutorialChallenges(): Challenge[] {
  const tutorials: Challenge[] = [
    {
      id: 'tutorial_1',
      type: ChallengeType.READ_TIME,
      targetTime: { hours: 5, minutes: 0, seconds: 0 },
      timeLimit: 60,
      points: 50,
      hint: 'Start simple! This shows 5:00. Count the lit lamps in the top row (5-hour blocks).'
    },
    {
      id: 'tutorial_2',
      type: ChallengeType.READ_TIME,
      targetTime: { hours: 7, minutes: 0, seconds: 0 },
      timeLimit: 60,
      points: 75,
      hint: 'Now try 7:00. One 5-hour block (top row) plus two 1-hour blocks (second row).'
    },
    {
      id: 'tutorial_3',
      type: ChallengeType.READ_TIME,
      targetTime: { hours: 12, minutes: 15, seconds: 0 },
      timeLimit: 90,
      points: 100,
      hint: '12:15 - Two 5-hour blocks, two 1-hour blocks, and three 5-minute blocks (note the red quarter marker!).'
    },
    {
      id: 'tutorial_4',
      type: ChallengeType.SET_TIME,
      targetTime: { hours: 8, minutes: 30, seconds: 0 },
      timeLimit: 120,
      points: 150,
      hint: 'Set 8:30 by clicking the correct lamps. Remember: 8 = 1×5 + 3×1, 30 = 6×5 + 0×1'
    }
  ];
  
  return tutorials;
}

/**
 * Generate custom challenge for specific learning objectives
 */
export function generateCustomChallenge(
  type: ChallengeType,
  difficulty: Difficulty,
  constraints?: {
    minHours?: number;
    maxHours?: number;
    minMinutes?: number;
    maxMinutes?: number;
    timeLimit?: number;
  }
): Challenge {
  let targetTime: DigitalTime;
  
  if (constraints) {
    const hours = Math.floor(Math.random() * ((constraints.maxHours || 23) - (constraints.minHours || 0) + 1)) + (constraints.minHours || 0);
    const minutes = Math.floor(Math.random() * ((constraints.maxMinutes || 59) - (constraints.minMinutes || 0) + 1)) + (constraints.minMinutes || 0);
    targetTime = { hours, minutes, seconds: 0 };
  } else {
    targetTime = generateTimeForDifficulty(difficulty);
  }
  
  return {
    id: generateChallengeId(),
    type,
    targetTime,
    timeLimit: constraints?.timeLimit || getBaseTimeLimit(difficulty, type),
    points: calculateChallengePoints(difficulty, type, 1),
    hint: generateHint(type, targetTime, difficulty)
  };
}