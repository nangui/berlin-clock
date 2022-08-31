import { useState } from 'react'

import classes from './Converter.module.css'

const Converter = ({ handler }) => {

  const [ time, setTime ] = useState('')

  const handleChangeTime = (event) => {
    const target = event.target
    setTime(target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handler(time)
  }

  return (
    <div className={ classes.container }>

      <h2>Convert Time</h2>

      <form className={classes.form} onSubmit={handleSubmit}>
        
        <div>
          <div className={`${classes.inputGroup} ${classes.flexColumn}`}>
            <label htmlFor='digitalTime'>Time</label>
            <input
              type='text'
              id='digitalTime'
              placeholder='Enter your time'
              value={time}
              onChange={handleChangeTime}
              className={classes.input} />
          </div>
          <div>
            <small className={classes.textGray}>Ex: YOOOOOOOOOOOOOOOOOOOOOOO or 16:50:06</small>
          </div>
        </div>

        <button type='submit' className={classes.button}>
          Convert Time
        </button>

      </form>

    </div>
  )
}

export default Converter