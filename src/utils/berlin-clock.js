
class BerlinClock {
  #time = ''
  /**
   * The constructor of the Berlin Clock
   * @param {string} time 
   */
  constructor (time) {
    this.#time = time
  }

  /**
   * This function can take a time and return string wich represents a berlin time one minute part
   * @param {string} time
   * @returns string
   */
  singleMinutesRow (time = this.#time) {
    const minutes = +time.split(':')[1]
    const numberOfLightsOn = minutes % 5
    let convertedMinutes = "".padEnd(numberOfLightsOn, "Y")

    for (let i = 0; i < (4 - numberOfLightsOn); i++) {
      convertedMinutes += "O"
    }
    return convertedMinutes
  }

  /**
   * This function can take a time and return string wich represents a berlin time five minutes part
   * @param {string} time  
   * @returns string
   */
  fiveMinutesRow (time = this.#time) {
    const minutes = +time.split(':')[1]
    const numberOfLightsOn = minutes / 5
    const numberOfLightsOff = 11 - numberOfLightsOn
    // This variable will contains a berlin hour
    let convertedMinutes = ""

    for (let index = 1; index <= numberOfLightsOn; index++) {
      if (index % 3 === 0) {
        convertedMinutes += "R"
      } else {
        convertedMinutes += "Y"
      }
    }
    for (let index = 0; index < numberOfLightsOff; index++) {
      convertedMinutes += "O"
    }

    return convertedMinutes
  }

  /**
   * This function can take a time and return string wich represents a berlin time one hour part
   * @param {string} time
   * @returns string
   */
  singleHoursRow (time = this.#time) {
    const hour = +time.split(':')[0]
    if (hour % 5 === 0) {
      return "OOOO"
    } else if (hour % 5 === 1) {
      return "ROOO"
    } else if (hour % 5 === 2) {
      return "RROO"
    } else if (hour % 5 === 3) {
      return "RRRO"
    } else if (hour % 5 === 4) {
      return "RRRR"
    }
  }

  /**
   * This function can take a time and return string wich represents a berlin time five hour part
   * @param {string} time
   * @returns string
   */
  fiveHoursRow (time = this.#time) {
    const hour = +time.split(':')[0]
    if (Math.trunc(hour / 5) === 0) {
      return "OOOO"
    } else if (Math.trunc(hour / 5) === 1) {
      return "ROOO"
    } else if (Math.trunc(hour / 5) === 2) {
      return "RROO"
    } else if (Math.trunc(hour / 5) === 3) {
      return "RRRO"
    } else if (Math.trunc(hour / 5) === 4) {
      return "RRRR"
    }
  }

  /**
   * This function can take a time and returns string wich represents a berlin time second part
   * @param {string} time
   * @returns string
   */
  secondLamp (time = this.#time) {
    const seconds = +time.split(':')[2]
    if (seconds % 2 === 0) {
      return "Y";
    }
    return "O";
  }

  /**
   * This function can take a time and returns convert digital time to berlin time
   * @returns string
   */
  toBerlinTime () {
    return this.secondLamp() 
      + this.fiveHoursRow()
      + this.singleHoursRow()
      + this.fiveMinutesRow()
      + this.singleMinutesRow()
  }

  /**
   * This function should take a string as a parameter which represents a berlin time and convert it to the digital time
   * @param {string} berlinClock 
   * @returns string
   */
  toDigitalTime(berlinClock = "") {
    const seconds = berlinClock.slice(0, 1)
    const fiveHourBlock = berlinClock.slice(1, 5)
    const singleHourBlock = berlinClock.slice(5, 9)
    const fiveMinuteBlock = berlinClock.slice(9, 20)
    const singleMinuteBlock = berlinClock.slice(-4)
    let hourCount = ((fiveHourBlock.match(/R/g) || []).length * 5) + (singleHourBlock.match(/R/g) || []).length
    let minuteCount = ((11 - (fiveMinuteBlock.match(/O/g) || []).length) * 5) + (singleMinuteBlock.match(/Y/g) || []).length

    if (hourCount === 0) hourCount = hourCount + '0'
    if (minuteCount === 0) minuteCount = minuteCount + '0'

    return hourCount + ':' + minuteCount
  }
}

export default BerlinClock