import { DigitalTime, BerlinTime, Difficulty } from '@/types';

/**
 * Convert digital time to Berlin Clock format
 */
export function convertDigitalToBerlin(digitalTime: DigitalTime): BerlinTime {
  const { hours, minutes, seconds } = digitalTime;
  
  // Validate input
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    throw new Error('Invalid time values provided');
  }

  return {
    // Seconds indicator (blinks every 2 seconds)
    seconds: seconds % 2 === 0,
    
    // Hours - 5 hour blocks (top row)
    hours5: [
      hours >= 5,
      hours >= 10,
      hours >= 15,
      hours >= 20
    ],
    
    // Hours - 1 hour blocks (second row)
    hours1: [
      hours % 5 >= 1,
      hours % 5 >= 2,
      hours % 5 >= 3,
      hours % 5 >= 4
    ],
    
    // Minutes - 5 minute blocks (third row) with quarter markers
    minutes5: [
      minutes >= 5,
      minutes >= 10,
      minutes >= 15, // Red quarter marker
      minutes >= 20,
      minutes >= 25,
      minutes >= 30, // Red quarter marker
      minutes >= 35,
      minutes >= 40,
      minutes >= 45, // Red quarter marker
      minutes >= 50,
      minutes >= 55
    ],
    
    // Minutes - 1 minute blocks (bottom row)
    minutes1: [
      minutes % 5 >= 1,
      minutes % 5 >= 2,
      minutes % 5 >= 3,
      minutes % 5 >= 4
    ]
  };
}

/**
 * Convert Berlin Clock format to digital time
 */
export function convertBerlinToDigital(berlinTime: BerlinTime): DigitalTime {
  // Calculate hours
  const hours5Count = berlinTime.hours5.filter(Boolean).length;
  const hours1Count = berlinTime.hours1.filter(Boolean).length;
  const hours = hours5Count * 5 + hours1Count;
  
  // Calculate minutes
  const minutes5Count = berlinTime.minutes5.filter(Boolean).length;
  const minutes1Count = berlinTime.minutes1.filter(Boolean).length;
  const minutes = minutes5Count * 5 + minutes1Count;
  
  // Seconds are ambiguous in Berlin Clock, so we return 0
  // In practice, this would need additional context
  const seconds = 0;
  
  return { hours, minutes, seconds };
}

/**
 * Generate a random valid digital time
 */
export function generateRandomTime(): DigitalTime {
  return {
    hours: Math.floor(Math.random() * 24),
    minutes: Math.floor(Math.random() * 60),
    seconds: Math.floor(Math.random() * 60)
  };
}

/**
 * Generate a time based on difficulty level
 */
export function generateTimeForDifficulty(difficulty: string | Difficulty): DigitalTime {
  switch (difficulty) {
    case 'beginner':
      // Round hours and minutes to make it easier
      return {
        hours: Math.floor(Math.random() * 12) + 1, // 1-12
        minutes: Math.floor(Math.random() * 12) * 5, // 0, 5, 10, 15, ..., 55
        seconds: 0
      };
      
    case 'intermediate':
      // Any hour, minutes in 5-minute increments
      return {
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 12) * 5,
        seconds: Math.floor(Math.random() * 6) * 10 // 0, 10, 20, 30, 40, 50
      };
      
    case 'advanced':
      // Any hour, any minute, but round seconds
      return {
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 6) * 10
      };
      
    case 'expert':
      // Completely random
      return generateRandomTime();
      
    default:
      return generateRandomTime();
  }
}

/**
 * Format digital time as string
 */
export function formatDigitalTime(time: DigitalTime, includeSeconds: boolean = true): string {
  const hours = time.hours.toString().padStart(2, '0');
  const minutes = time.minutes.toString().padStart(2, '0');
  const seconds = time.seconds.toString().padStart(2, '0');
  
  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
}

/**
 * Parse time string to DigitalTime
 */
export function parseTimeString(timeString: string): DigitalTime {
  const parts = timeString.split(':');
  
  if (parts.length < 2 || parts.length > 3) {
    throw new Error('Invalid time format. Expected HH:MM or HH:MM:SS');
  }
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts.length === 3 ? parseInt(parts[2], 10) : 0;
  
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error('Invalid time values');
  }
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    throw new Error('Time values out of range');
  }
  
  return { hours, minutes, seconds };
}

/**
 * Get current time as DigitalTime
 */
export function getCurrentTime(): DigitalTime {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };
}

/**
 * Check if two times are equal
 */
export function timesEqual(time1: DigitalTime, time2: DigitalTime, compareSeconds: boolean = true): boolean {
  return time1.hours === time2.hours && 
         time1.minutes === time2.minutes && 
         (!compareSeconds || time1.seconds === time2.seconds);
}

/**
 * Calculate time difference in seconds
 */
export function timeDifferenceInSeconds(time1: DigitalTime, time2: DigitalTime): number {
  const seconds1 = time1.hours * 3600 + time1.minutes * 60 + time1.seconds;
  const seconds2 = time2.hours * 3600 + time2.minutes * 60 + time2.seconds;
  return Math.abs(seconds1 - seconds2);
}

/**
 * Add seconds to a time
 */
export function addSecondsToTime(time: DigitalTime, seconds: number): DigitalTime {
  const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds + seconds;
  const daySeconds = 24 * 3600;
  const normalizedSeconds = ((totalSeconds % daySeconds) + daySeconds) % daySeconds;
  
  const hours = Math.floor(normalizedSeconds / 3600);
  const minutes = Math.floor((normalizedSeconds % 3600) / 60);
  const remainingSeconds = normalizedSeconds % 60;
  
  return {
    hours,
    minutes,
    seconds: remainingSeconds
  };
}

/**
 * Validate Berlin Clock state
 */
export function validateBerlinTime(berlinTime: BerlinTime): boolean {
  // Check array lengths
  if (berlinTime.hours5.length !== 4 || 
      berlinTime.hours1.length !== 4 || 
      berlinTime.minutes5.length !== 11 || 
      berlinTime.minutes1.length !== 4) {
    return false;
  }
  
  // Check logical constraints
  const hours5Count = berlinTime.hours5.filter(Boolean).length;
  const hours1Count = berlinTime.hours1.filter(Boolean).length;
  const totalHours = hours5Count * 5 + hours1Count;
  
  const minutes5Count = berlinTime.minutes5.filter(Boolean).length;
  const minutes1Count = berlinTime.minutes1.filter(Boolean).length;
  const totalMinutes = minutes5Count * 5 + minutes1Count;
  
  // Validate ranges
  if (totalHours > 23 || totalMinutes > 59) {
    return false;
  }
  
  // Validate lamp progression (lamps should be lit from left to right)
  const validateProgression = (lamps: boolean[]): boolean => {
    let foundOff = false;
    for (const lamp of lamps) {
      if (!lamp) {
        foundOff = true;
      } else if (foundOff) {
        return false; // Found an on lamp after an off lamp
      }
    }
    return true;
  };
  
  return validateProgression(berlinTime.hours5) &&
         validateProgression(berlinTime.hours1) &&
         validateProgression(berlinTime.minutes5) &&
         validateProgression(berlinTime.minutes1);
}