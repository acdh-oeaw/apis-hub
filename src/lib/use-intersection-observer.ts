import { useEffect } from 'react'

export function useIntersectionObserver(
  element: HTMLElement | null,
  callback: (() => void) | undefined,
): void {
  useEffect(() => {
    if (element == null) return
    if (callback == null) return

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry?.isIntersecting === true) {
        callback()
      }
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [element, callback])
}
