import { useContext } from 'react'
import Flag from './components/Flag/Index'
import './App.css'
import Clock from './components/Clock/Index'
import Converter from './components/Converter/Index'
import useConverter from './hooks/useConverter'
import { StoreContext } from './utils/store'

function App() {

  const { time, setTime, result } = useContext(StoreContext)

  const { hours, minutes, seconds } = useConverter()

  const handleSetTime = (newTime) => {
    if (newTime !== time) {
      setTime(newTime)
    }
  }
  
  return (
    <div className="App">
      <h1>Berlin Clock</h1>
{/* 
      <Flag>
        <Clock hours={hours} minutes={minutes} seconds={seconds} />
      </Flag> */}

      <Converter handler={handleSetTime} />

      <div>
        Resultat: { result }
      </div>
    </div>
  )
}

export default App
