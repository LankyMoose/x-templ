import { diffAndPatch } from "./diff.js"
import type { XElementConfig, XElementState } from "./types"

export abstract class XElement<
  Attrs extends string[],
  State extends XElementState = {}
> extends HTMLElement {
  static isUpdating = false
  static knownElements = new Set<string>()

  #cleanups: (() => void)[] = []
  #boundUpdate = this.#update.bind(this)
  #state: State

  constructor(private config: XElementConfig<Attrs, State>) {
    super()
    XElement.knownElements.add(this.tagName)
    const { shadow, state } = config
    if (shadow) this.attachShadow(shadow)
    this.#state = state?.() || ({} as State)
    for (const value of Object.values(this.#state)) {
      if ("subscribe" in value) {
        this.#cleanups.push(value.subscribe(this.#boundUpdate))
      }
    }
  }

  onMounted?(this: XElement<Attrs, State>): void | (() => void)
  onAttributeChanged?(name: string, oldValue: string, newValue: string): void
  abstract render(): Node[]

  $emit(name: string): void {
    this.dispatchEvent(new CustomEvent(name))
  }

  $state(): State {
    return this.#state
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return
    if (this.config.observedAttributes?.includes(name)) {
      this.onAttributeChanged?.(name, oldValue, newValue)
      if (!XElement.isUpdating) this.#update()
    }
  }

  connectedCallback() {
    this.#update()
    const cleanup = this.onMounted?.()
    if (typeof cleanup === "function") this.#cleanups.push(cleanup)
  }

  disconnectedCallback() {
    while (this.#cleanups.length) this.#cleanups.pop()!()
  }

  #update() {
    XElement.isUpdating = true
    const root = this.shadowRoot || this
    diffAndPatch(root, root.childNodes, this.render())
    XElement.isUpdating = false
  }
}
