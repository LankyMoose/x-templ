import type { XElement } from "./x-element"

export type InferXElementType<T extends string[]> = XElement & {
  $attribute: <K extends T[number]>(name: K, fallback?: string) => string
  $emit: (name: string) => void
}

export type XElementConfig<T extends string[]> = {
  observedAttributes?: T
  onAttributeChanged?: (
    this: InferXElementType<T>,
    name: T[number],
    oldValue: string,
    newValue: string
  ) => void
  render: (this: InferXElementType<T>) => Node[]
  onMounted?: XElement["onMounted"]
  onUnmounted?: XElement["onUnmounted"]
}

export type Ref<T> = {
  current: T
}

export type Reactive<T> = {
  get(): T
  set(value: T): void
  subscribe(fn: (current: T, prev: T) => void): () => void
}
