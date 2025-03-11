import { useEffect, useState } from 'react'

export const useDebounce = () => {
  const [timerID, setTimerID] = useState()

  const setDebouncedValue = (callback, delay) => {
    clearTimeout(timerID)
    setTimerID(
      setTimeout(() => {
        callback()
      }, delay ?? 500)
    )
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerID)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return setDebouncedValue
}
