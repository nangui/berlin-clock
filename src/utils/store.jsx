import { useState, createContext } from 'react'

const initialValue = {
  time: '',
  result: '',
  setTime: () => {},
  setResult: () => {}
}

export const StoreContext = createContext(initialValue) 

export default ({ children }) => {

  const [time, setTime] = useState('')
  const [result, setResult] = useState('')

  const store = {
    time, setTime,
    result, setResult
  }

  return (
    <StoreContext.Provider value={store}>
      { children }
    </StoreContext.Provider>
  )
}
