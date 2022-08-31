import { useState, useEffect, useContext } from 'react'
import TimeConverter from '../utils/converter'
import { StoreContext } from '../utils/store'

const useConverter = () => {

  const { time, setResult } = useContext(StoreContext)

  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (time !== '') {
      // This function (split) will return an array of string - Ex: 12:43:30 -> ['12', '43', '30']
      const splittedTime = time.split(':')
      if (splittedTime.length === 3) {
        // Adding the + sign on the front of string will convert it to a number
        setHours(+splittedTime[0])
        setMinutes(+splittedTime[1])
        setSeconds(+splittedTime[2])

        // Convert Digital time to berlin time
        const berlinTime = TimeConverter.digitalToBerlin(time)
        setResult(berlinTime)
      } else {
        // Convert Berlin time to Digital time
        const digitalTime = TimeConverter.berlinToDigital(time)
        setResult(digitalTime)
      }

    }
  }, [time])

  useEffect(() => {
    // This function will be executed every second 
    const interval = setInterval(() => {
      setSeconds(seconds + 1)

      // This condition is to chek if seconds equals 59 to see if we should increment minute and reset second to 0
      if (seconds === 59) {
        setSeconds(0)
        setMinutes(minutes + 1)
      }

      // This condition is to chek if minutes equals 59 to see if we should increment hour and reset second and minute to 0
      if (minutes === 59) {
        setHours(hours + 1)
        setMinutes(0)
        setSeconds(0)
      }

      if (hours === 24) {
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }

    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, minutes, hours])

  return { hours, minutes, seconds }
}

export default useConverter
