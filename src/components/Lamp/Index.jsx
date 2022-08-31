import classes from './Lamp.module.css'

export function Circle () {
  return (
    <div className={classes.circle}>
      <div className={classes.circleColor}></div>
    </div>
  )
}

export function Rectangle () {
  return (
    <div className={classes.rectangle}></div>
  )
}

export function InversedRectangle () {
  return (
    <div className={classes.inversedRectangle}></div>
  )
}
