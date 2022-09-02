import { useContext } from 'react'
import { useState } from 'react'
import { StoreContext } from '../../utils/store'

import classes from './Converter.module.css'

const Converter = ({ handler }) => {

  const {setResult} = useContext(StoreContext)
  const [ time, setTime ] = useState('')

  const handleChangeTime = (event) => {
    const target = event.target
    setTime(target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handler(time)
  }

  const resetForm = () => {
    setTime('')
    handler('')
    setResult('')
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

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1.2rem' }}>
          <button type='submit' className={classes.button}>
            Convert Time
          </button>
          <a href='#' onClick={resetForm}>Reinitialiser</a>
        </div>

      </form>

    </div>
  )
}

export default Converter