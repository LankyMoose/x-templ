import type { XElement } from "./x-element"

export type XElementState = Record<string, Inert<any> | Reactive<any>>

export type XElementConfig<
  Attrs extends string[],
  State extends XElementState
> = {
  state?: () => State
  shadow?: ShadowRootInit
  observedAttributes?: Attrs
  onAttributeChanged?: (
    this: XElement<Attrs, State>,
    name: Attrs[number],
    oldValue: string,
    newValue: string
  ) => void
  render: (this: XElement<Attrs, State>) => Node[]
  onMounted?: XElement<Attrs, State>["onMounted"]
}

export type Inert<T> = {
  current: T
}

export type Reactive<T> = {
  get(): T
  set(value: T | ((prev: T) => T)): void
  subscribe(fn: (current: T, prev: T) => void): () => void
}
