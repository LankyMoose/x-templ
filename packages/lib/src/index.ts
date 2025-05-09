import { XElementConfig } from "./types"
import { XElement } from "./x-element.js"

export { html } from "./html.js"

export function defineElement<const T extends string[]>(
  tag: string,
  config: XElementConfig<T>
) {
  let onAttributeChanged: XElementConfig<T>["onAttributeChanged"]
  customElements.define(
    tag,
    class extends XElement {
      static observedAttributes = config.observedAttributes
      constructor() {
        super()
        if (config.shadow) this.attachShadow(config.shadow)
      }
      $attribute<K extends T[number]>(name: K, fallback?: string) {
        return this.getAttribute(name) || fallback || ""
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
      ) {
        if (XElement.isUpdating || oldValue === newValue) return
        if (config.observedAttributes?.includes(name)) {
          ;(onAttributeChanged as Function)?.(name, oldValue, newValue)
          this.update()
        }
      }
      onAttributeChanged = config.onAttributeChanged?.bind(this as any)
      render = config.render.bind(this as any) as () => Node[]
      onMounted = config.onMounted?.bind(this as any)
      onUnmounted = config.onUnmounted?.bind(this as any)
    }
  )
}
