export function html(
  strings: TemplateStringsArray,
  ...values: (string | number | Function | Node[])[]
): Node[] {
  // Step 1: Construct HTML string with placeholders
  const markers = values.map((_, i) => `{{__${i}__}}`)
  let htmlString = ""
  for (let i = 0; i < strings.length; i++) {
    htmlString += strings[i]
    if (i < markers.length) htmlString += markers[i]
  }

  // Step 2: Parse HTML into a DocumentFragment
  const template = document.createElement("template")
  template.innerHTML = htmlString.trim()

  // Step 3: Walk nodes and replace markers
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null
  )

  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i]
        if (!node.nodeValue?.includes(marker)) continue
        const currentTemplateValue = values[i]
        // in order to deal with values created via html``, we need to normalize
        // the current template value
        const currentValues = Array.isArray(currentTemplateValue)
          ? currentTemplateValue
          : [currentTemplateValue]

        for (let j = 0; j < currentValues.length; j++) {
          const value = currentValues[j]
          if (value instanceof Node) {
            const parts = node.nodeValue!.split(marker)
            const parent = node.parentNode!
            if (parts[0])
              parent.insertBefore(document.createTextNode(parts[0]), node)
            parent.insertBefore(value, node)
            if (parts[1])
              parent.insertBefore(document.createTextNode(parts[1]), node)
            parent.removeChild(node)
          } else {
            node.nodeValue = node.nodeValue!.replace(marker, String(value))
          }
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      for (const attr of Array.from(el.attributes)) {
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i]
          if (attr.value.includes(marker)) {
            const value = values[i]
            if (attr.name.startsWith("on") && typeof value === "function") {
              el.removeAttribute(attr.name)
              el.addEventListener(
                attr.name.slice(2).toLowerCase(),
                value as any
              )
            } else {
              el.setAttribute(attr.name, String(value))
            }
          }
        }
      }
    }
  }

  return Array.from(template.content.childNodes)
}
