import type { Reactive } from "./types"

export function reactive<T>(initialValue: T): Reactive<T> {
  const listeners = new Set<(current: T, prev: T) => void>()
  let current = initialValue
  return {
    get() {
      return current
    },
    set(value) {
      const prev = current
      if (Object.is(prev, value)) return
      current = value
      listeners.forEach((fn) => fn(value, prev))
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
