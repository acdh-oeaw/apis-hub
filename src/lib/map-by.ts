export function mapBy<T extends object, K extends keyof T>(items: Array<T>, key: K): Map<T[K], T> {
  const map: Map<T[K], T> = new Map()

  items.forEach((item) => {
    const id = item[key]
    map.set(id, item)
  })

  return map
}
