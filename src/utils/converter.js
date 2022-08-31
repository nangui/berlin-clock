import BerlinClock from "./berlin-clock"

/**
 * This function convert berlin time to digital time
 * @param {string} berlinTime 
 * @returns string
 */
const berlinToDigital = (berlinTime) => {
  const berlinClock = new BerlinClock
  return berlinClock.toDigitalTime(berlinTime)
}

/**
 * This function convert digital time to berlin time
 * @param {string} digitalTime 
 * @returns string
 */
const digitalToBerlin = (digitalTime) => {
  const berlinClock = new BerlinClock(digitalTime)
  return berlinClock.toBerlinTime();
}

// An object time converter to facilitate the use of thos two function
// It'll allow us to use that like - Ex: const response = TimeConverter.digitalToBerlin('00:00:00')
const TimeConverter = {
  berlinToDigital: berlinToDigital,
  digitalToBerlin: digitalToBerlin
}

export default TimeConverter
