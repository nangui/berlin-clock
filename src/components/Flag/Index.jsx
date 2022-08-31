import classes from './Flag.module.css'

function Flag ({ children }) {

  return (
    <div className={classes.container}>
      <div className={classes.flag}>
        <div className={classes.blackLine}></div>
        <div className={classes.redLine}></div>
        <div className={classes.goldLine}></div>
      </div>
      <div className={classes.content}>
        { children }
      </div>
    </div>
  )
}

export default Flag