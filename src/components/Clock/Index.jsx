import Line from '../Line'
import { Circle, InversedRectangle, Rectangle } from '../Lamp/Index'
import classes from './Clock.module.css'
import { useContext, useEffect } from 'react'
import { StoreContext } from '../../utils/store'
import TimeConverter from '../../utils/converter'
import { useState } from 'react'

function Clock () {
  const { time } = useContext(StoreContext)

  const [ berlinTime, setBerlinTime ] = useState('');

  useEffect(() => {
    const splittedTime = time.split(':')
    if (splittedTime.length === 3) {
      const response = TimeConverter.digitalToBerlin(time)
      setBerlinTime(response)
    }
  }, [time])

  if (!time) return null

  return (
    <div className={ classes.clock }>

      <Line className={`${classes.line} ${classes.around} line-1`}>
        <Circle color={berlinTime.slice(0, 1)} />
      </Line>

      <Line className={`${classes.line} line-2`}>
        { berlinTime && berlinTime.slice(1, 5).split('').map((val, index) => (
          <Rectangle key={index} color={val} />
        )) }
      </Line>

      <Line className={`${classes.line} line-3`}>
        { berlinTime && berlinTime.slice(5, 9).split('').map((val, index) => (
          <Rectangle key={index} color={val} />
        )) }
      </Line>

      <Line className={`${classes.line} line-4`}>
        { berlinTime && berlinTime.slice(9, 20).split('').map((val, index) => (
          <InversedRectangle key={index} color={val} />
        )) }
      </Line>

      <Line className={`${classes.line} line-5`}>
        { berlinTime && berlinTime.slice(-4).split('').map((val, index) => (
          <Rectangle key={index} color={val} />
        )) }
      </Line>
      
    </div>
  )
}

export default Clock