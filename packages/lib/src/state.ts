import type { Reactive, Inert } from "./types"

export function $reactive<T>(initialValue: T): Reactive<T> {
  const listeners = new Set<(current: T, prev: T) => void>()
  let current = initialValue
  return {
    get() {
      return current
    },
    set(value) {
      const next =
        typeof value === "function" ? (value as Function)(current) : value
      if (Object.is(current, next)) return

      const prev = current
      current = next
      listeners.forEach((fn) => fn(current, prev))
    },
    subscribe(fn) {
      return listeners.add(fn), () => listeners.delete(fn)
    },
  }
}

export function $inert<T>(initialValue: T): Inert<T> {
  return { current: initialValue }
}
