import { beforeEach, describe, expect, it } from 'vitest'
import BerlinClock from '../utils/berlin-clock';

describe('BerlinClock', () => {
  describe('Feature 1 - Converting Digital Time To Berlin Time', () => {
    let berlinClock = null;

    beforeEach(() => {
      berlinClock = new BerlinClock('00:00:00');
    })

    it('should take an minutes and turn it on the single minutes lights', () => {
      expect(berlinClock.singleMinutesRow()).toEqual('OOOO')
      expect(berlinClock.singleMinutesRow('23:59:59')).toEqual('YYYY')
      expect(berlinClock.singleMinutesRow('12:32:00')).toEqual('YYOO')
      expect(berlinClock.singleMinutesRow('12:34:00')).toEqual('YYYY')
      expect(berlinClock.singleMinutesRow('12:35:00')).toEqual('OOOO')
    })

    it('should take an minutes and turn it on the five minutes lights', () => {
      expect(berlinClock.fiveMinutesRow()).toEqual('OOOOOOOOOOO')
      expect(berlinClock.fiveMinutesRow('23:59:59')).toEqual('YYRYYRYYRYY')
      expect(berlinClock.fiveMinutesRow('12:04:00')).toEqual('OOOOOOOOOOO')
      expect(berlinClock.fiveMinutesRow('12:23:00')).toEqual('YYRYOOOOOOO')
      expect(berlinClock.fiveMinutesRow('12:35:00')).toEqual('YYRYYRYOOOO')
    })

    it('should take an hour and turn it on the single hours lights', () => {
      expect(berlinClock.singleHoursRow()).toEqual('OOOO')
      expect(berlinClock.singleHoursRow('23:59:59')).toEqual('RRRO')
      expect(berlinClock.singleHoursRow('02:04:00')).toEqual('RROO')
      expect(berlinClock.singleHoursRow('06:04:00')).toEqual('ROOO')
      expect(berlinClock.singleHoursRow('08:23:00')).toEqual('RRRO')
      expect(berlinClock.singleHoursRow('14:35:00')).toEqual('RRRR')
    })

    it('should take an hour and turn it on the five hours lights', () => {
      expect(berlinClock.fiveHoursRow()).toEqual('OOOO')
      expect(berlinClock.fiveHoursRow('23:59:59')).toEqual('RRRR')
      expect(berlinClock.fiveHoursRow('02:04:00')).toEqual('OOOO')
      expect(berlinClock.fiveHoursRow('08:23:00')).toEqual('ROOO')
      expect(berlinClock.fiveHoursRow('16:35:00')).toEqual('RRRO')
      expect(berlinClock.fiveHoursRow('10:35:00')).toEqual('RROO')
    })

    it('should take a second and turn it on the second light', () => {
      expect(berlinClock.secondLamp()).toEqual('Y')
      expect(berlinClock.secondLamp('23:59:59')).toEqual('O')
    })

    it('should take a digital hour and turn it on the berlin time', () => {
      expect(berlinClock.toBerlinTime()).toEqual('YOOOOOOOOOOOOOOOOOOOOOOO')
      expect(berlinClock.toBerlinTime('23:59:59')).toEqual('YOOOOOOOOOOOOOOOOOOOOOOO')
      expect(berlinClock.toBerlinTime('16:50:06')).toEqual('YOOOOOOOOOOOOOOOOOOOOOOO')
      expect(berlinClock.toBerlinTime('11:37:01')).toEqual('YOOOOOOOOOOOOOOOOOOOOOOO')
    })
  })

  describe('Feature 2 - Converting Berlin Time to Digital Time', () => {
    let berlinClock = null;

    beforeEach(() => {
      berlinClock = new BerlinClock('00:00:00');
    })

    it ('should take a berlin time and turn it on the digital time', () => {
      expect(berlinClock.toDigitalTime('YOOOOOOOOOOOOOOOOOOOOOOO')).toEqual('00:00')
      expect(berlinClock.toDigitalTime('ORRRRRRROYYRYYRYYRYYYYYY')).toEqual('23:59')
      expect(berlinClock.toDigitalTime('YRRROROOOYYRYYRYYRYOOOOO')).toEqual('16:50')
      expect(berlinClock.toDigitalTime('ORROOROOOYYRYYRYOOOOYYOO')).toEqual('11:37')
    })
  })
})
