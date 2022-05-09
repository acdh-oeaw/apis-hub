import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    let canceled = false

    const timeout = setTimeout(() => {
      if (!canceled) {
        setDebouncedValue(value)
      }
    }, delay)

    return () => {
      canceled = true
      clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedValue
}
