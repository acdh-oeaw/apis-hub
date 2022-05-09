import { useReducer } from 'react'

export function useForceRender(): () => void {
  const [, dispatch] = useReducer(() => {
    return []
  }, [])

  return dispatch
}
