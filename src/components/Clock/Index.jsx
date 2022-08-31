import Line from '../Line'
import { Circle, Rectangle, InversedRectangle } from '../Lamp/Index'
import classes from './Clock.module.css'

function Clock ({ hours, minutes, seconds }) {
  return (
    <div className={ classes.clock }>

      <Line className={`${classes.line} ${classes.around} line-1`}>
        <Circle />
      </Line>

      <Line className={`${classes.line} line-2`}>
        { Array.apply(null, Array(4)).map((_, index) => (
          <Rectangle key={index} />
        )) }
      </Line>

      <Line className={`${classes.line} line-3`}>
        { Array.apply(null, Array(4)).map((_, index) => (
          <Rectangle key={index} />
        )) }
      </Line>

      <Line className={`${classes.line} line-4`}>
        { Array.apply(null, Array(11)).map((_, index) => (
          <InversedRectangle key={index} />
        )) }
      </Line>

      <Line className={`${classes.line} line-5`}>
        { Array.apply(null, Array(4)).map((_, index) => (
          <Rectangle key={index} />
        )) }
      </Line>
      
    </div>
  )
}

export default Clock