import { XElementConfig, XElementState } from "./types"
import { XElement } from "./x-element.js"

export { html } from "./html.js"
export { $inert, $reactive } from "./state.js"

export function defineElement<
  const Attrs extends string[],
  State extends XElementState
>(tag: string, config: XElementConfig<Attrs, State>) {
  customElements.define(
    tag,
    class extends XElement<Attrs, State> {
      static observedAttributes = config.observedAttributes
      constructor() {
        super(config)
      }
      onAttributeChanged = config.onAttributeChanged?.bind(this as any)
      render = config.render.bind(this as any) as () => Node[]
      onMounted = config.onMounted?.bind(this as any)
    }
  )
}
