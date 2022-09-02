import classes from './Lamp.module.css'

export function Circle ({ color }) {

  return (
    <div className={classes.circle}>
      <div
        className={classes.circleColor}
        style={{backgroundColor: color === 'Y' ? 'var(--clr-red)' : '#000000'}}></div>
    </div>
  )
}

export function Rectangle ({ color }) {
  return (
    <div
      className={classes.rectangle}
      style={{backgroundColor: returnColor(color) }}></div>
  )
}

export function InversedRectangle ({ color }) {
  return (
    <div
      className={classes.inversedRectangle}
      style={{backgroundColor: returnColor(color) }}></div>
  )
}

function returnColor (color) {
  return color === 'R' ? 'var(--clr-red)' : color === 'Y' ? 'var(--clr-gold)' : '#000000' 
}
