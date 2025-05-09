import { diffAndPatch } from "./diff.js"
import { reactive } from "./reactive.js"
import type { Ref, Reactive } from "./types"

export abstract class XElement extends HTMLElement {
  static isUpdating = false
  static knownElements = new Set<string>()
  static resetStateCounter = (el: XElement) => (el.#stateIdx = 0)

  constructor() {
    super()
    XElement.knownElements.add(this.tagName)
  }

  #cleanups: (() => void)[] = []
  #state: any[] = []
  #stateIdx = 0
  #update = this.update.bind(this)

  abstract render(): Node[]
  onMounted?(): void
  onUnmounted?(): void

  connectedCallback() {
    this.update()
    this.onMounted?.()
  }

  disconnectedCallback() {
    while (this.#cleanups.length) this.#cleanups.pop()!()
    this.onUnmounted?.()
  }

  $state<T>(initialValue: T): Reactive<T> {
    const idx = this.#stateIdx++
    if (this.#state[idx]) return this.#state[idx]
    const state = (this.#state[idx] = reactive(initialValue))
    this.#cleanups.push(state.subscribe(this.#update))
    return state
  }

  $ref<T>(initialValue: T): Ref<T> {
    const idx = this.#stateIdx++
    if (this.#state[idx]) return this.#state[idx]
    const state = (this.#state[idx] = { current: initialValue })
    this.#cleanups.push(() => (this.#state[idx] = undefined))
    return state
  }

  $emit(name: string) {
    this.dispatchEvent(new CustomEvent(name))
  }

  update() {
    XElement.isUpdating = true
    this.#stateIdx = 0
    const root = this.shadowRoot || this
    diffAndPatch(root, root.childNodes, this.render())
    XElement.isUpdating = false
  }
}
