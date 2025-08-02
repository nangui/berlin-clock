import { Difficulty, ChallengeType } from '@/types';

/**
 * Calculate score for a completed challenge
 */
export function calculateScore(
  difficulty: Difficulty,
  timeRemaining: number,
  streak: number,
  challengeType?: ChallengeType,
  perfect: boolean = true
): number {
  const baseScore = getBaseScore(difficulty, challengeType);
  const timeBonus = calculateTimeBonus(timeRemaining, difficulty);
  const streakMultiplier = calculateStreakMultiplier(streak);
  const perfectBonus = perfect ? 1.2 : 1.0;
  
  return Math.round(baseScore * timeBonus * streakMultiplier * perfectBonus);
}

/**
 * Get base score for difficulty and challenge type
 */
function getBaseScore(difficulty: Difficulty, challengeType?: ChallengeType): number {
  const difficultyScores = {
    [Difficulty.BEGINNER]: 100,
    [Difficulty.INTERMEDIATE]: 200,
    [Difficulty.ADVANCED]: 350,
    [Difficulty.EXPERT]: 500
  };
  
  const typeMultipliers = {
    [ChallengeType.READ_TIME]: 1.0,
    [ChallengeType.SET_TIME]: 1.2,
    [ChallengeType.QUICK_MATCH]: 1.5,
    [ChallengeType.MEMORY_FLASH]: 2.0
  };
  
  const baseScore = difficultyScores[difficulty];
  const typeMultiplier = challengeType ? typeMultipliers[challengeType] : 1.0;
  
  return baseScore * typeMultiplier;
}

/**
 * Calculate time bonus based on remaining time and difficulty
 */
function calculateTimeBonus(timeRemaining: number, difficulty: Difficulty): number {
  if (timeRemaining <= 0) return 0.5; // Penalty for timeout
  
  const maxTimeBonus = {
    [Difficulty.BEGINNER]: 1.5,
    [Difficulty.INTERMEDIATE]: 1.8,
    [Difficulty.ADVANCED]: 2.0,
    [Difficulty.EXPERT]: 2.5
  };
  
  const maxBonus = maxTimeBonus[difficulty];
  
  // Bonus scales with remaining time percentage
  // More remaining time = higher bonus
  const timePercentage = Math.min(1, timeRemaining / 60); // Assume max 60 seconds
  return 1 + (maxBonus - 1) * timePercentage;
}

/**
 * Calculate streak multiplier
 */
function calculateStreakMultiplier(streak: number): number {
  if (streak <= 0) return 1.0;
  
  // Exponential growth with diminishing returns
  return 1 + Math.log(streak + 1) * 0.2;
}

/**
 * Calculate combo bonus for consecutive perfect answers
 */
export function calculateComboBonus(consecutivePerfect: number): number {
  if (consecutivePerfect < 3) return 1.0;
  
  return 1 + (consecutivePerfect - 2) * 0.1; // 10% bonus per perfect after 3
}

/**
 * Calculate level completion bonus
 */
export function calculateLevelBonus(level: number, perfectChallenges: number, totalChallenges: number): number {
  const levelMultiplier = 1 + (level - 1) * 0.1;
  const accuracyBonus = perfectChallenges / totalChallenges;
  
  return Math.round(1000 * levelMultiplier * accuracyBonus);
}

/**
 * Calculate experience points for skill progression
 */
export function calculateExperience(
  score: number,
  difficulty: Difficulty,
  performance: PerformanceMetrics
): number {
  const baseXP = score * 0.1; // 10% of score as base XP
  
  const difficultyMultiplier = {
    [Difficulty.BEGINNER]: 1.0,
    [Difficulty.INTERMEDIATE]: 1.5,
    [Difficulty.ADVANCED]: 2.0,
    [Difficulty.EXPERT]: 3.0
  };
  
  const accuracyBonus = performance.accuracy > 0.9 ? 1.5 : 1.0;
  const speedBonus = performance.averageTime < 10 ? 1.3 : 1.0;
  
  return Math.round(baseXP * difficultyMultiplier[difficulty] * accuracyBonus * speedBonus);
}

/**
 * Performance metrics calculation
 */
export interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  totalTime: number;
  challengesCompleted: number;
  perfectAnswers: number;
  streak: number;
  efficiency: number; // Score per second
}

export function calculatePerformanceMetrics(
  scores: number[],
  times: number[],
  correct: boolean[],
  timeouts: boolean[]
): PerformanceMetrics {
  const totalChallenges = correct.length;
  const correctAnswers = correct.filter(Boolean).length;
  const perfectAnswers = correct.filter((c, i) => c && !timeouts[i]).length;
  
  const totalTime = times.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / totalChallenges;
  const accuracy = correctAnswers / totalChallenges;
  
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const efficiency = totalScore / totalTime;
  
  // Calculate current streak
  let streak = 0;
  for (let i = correct.length - 1; i >= 0; i--) {
    if (correct[i]) {
      streak++;
    } else {
      break;
    }
  }
  
  return {
    accuracy,
    averageTime,
    totalTime,
    challengesCompleted: totalChallenges,
    perfectAnswers,
    streak,
    efficiency
  };
}

/**
 * Calculate rank based on overall performance
 */
export interface PlayerRank {
  rank: string;
  title: string;
  nextRank: string;
  progressToNext: number;
  requirements: string[];
}

export function calculatePlayerRank(
  totalScore: number,
  totalXP: number,
  achievements: number
): PlayerRank {
  const ranks = [
    { name: 'Novice', title: 'Time Learner', minScore: 0, minXP: 0, minAchievements: 0 },
    { name: 'Apprentice', title: 'Clock Reader', minScore: 1000, minXP: 500, minAchievements: 3 },
    { name: 'Practitioner', title: 'Time Keeper', minScore: 5000, minXP: 2000, minAchievements: 8 },
    { name: 'Expert', title: 'Clock Master', minScore: 15000, minXP: 7500, minAchievements: 15 },
    { name: 'Master', title: 'Time Lord', minScore: 35000, minXP: 20000, minAchievements: 25 },
    { name: 'Grandmaster', title: 'Berlin Clock Sage', minScore: 75000, minXP: 50000, minAchievements: 40 }
  ];
  
  let currentRank = ranks[0];
  let nextRank = ranks[1];
  
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    if (totalScore >= rank.minScore && totalXP >= rank.minXP && achievements >= rank.minAchievements) {
      currentRank = rank;
      nextRank = ranks[i + 1] || rank;
    } else {
      break;
    }
  }
  
  // Calculate progress to next rank
  let progressToNext = 1.0;
  if (nextRank !== currentRank) {
    const scoreProgress = Math.min(1, totalScore / nextRank.minScore);
    const xpProgress = Math.min(1, totalXP / nextRank.minXP);
    const achievementProgress = Math.min(1, achievements / nextRank.minAchievements);
    progressToNext = (scoreProgress + xpProgress + achievementProgress) / 3;
  }
  
  const requirements = nextRank !== currentRank ? [
    `Score: ${totalScore.toLocaleString()}/${nextRank.minScore.toLocaleString()}`,
    `XP: ${totalXP.toLocaleString()}/${nextRank.minXP.toLocaleString()}`,
    `Achievements: ${achievements}/${nextRank.minAchievements}`
  ] : ['Maximum rank achieved!'];
  
  return {
    rank: currentRank.name,
    title: currentRank.title,
    nextRank: nextRank.name,
    progressToNext,
    requirements
  };
}

/**
 * Calculate daily challenge bonus
 */
export function calculateDailyChallengeBonus(
  consecutiveDays: number,
  perfectDays: number
): number {
  const consistencyBonus = Math.min(consecutiveDays * 50, 1000); // Max 1000 for 20+ days
  const perfectBonus = perfectDays * 100;
  
  return consistencyBonus + perfectBonus;
}

/**
 * Calculate achievement progress
 */
export function updateAchievementProgress(
  currentProgress: Record<string, number>,
  action: string,
  value: number = 1
): Record<string, number> {
  const updatedProgress = { ...currentProgress };
  
  // Define achievement criteria
  const achievementActions = [
    'challenges_completed',
    'perfect_answers',
    'time_challenges',
    'memory_games',
    'tutorial_completed',
    'streak_achieved',
    'score_milestone',
    'speed_demon', // Fast completion
    'accuracy_expert', // High accuracy
    'consistency_king' // Daily play streak
  ];
  
  if (achievementActions.includes(action)) {
    updatedProgress[action] = (updatedProgress[action] || 0) + value;
  }
  
  return updatedProgress;
}

/**
 * Calculate score multiplier for special events
 */
export function getEventMultiplier(eventType: string, playerLevel: number): number {
  switch (eventType) {
    case 'double_xp':
      return 2.0;
    case 'score_boost':
      return 1.5;
    case 'weekend_bonus':
      return 1.25;
    case 'level_up_celebration':
      return 1 + (playerLevel * 0.1);
    default:
      return 1.0;
  }
}