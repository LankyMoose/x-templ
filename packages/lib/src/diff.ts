import { XElement } from "./x-element.js"

export function diffAndPatch(
  parent: Node,
  oldNodes: NodeList,
  newNodes: Node[]
) {
  const prev = Array.from(oldNodes)
  const maxLength = Math.max(prev.length, newNodes.length)

  for (let i = 0; i < maxLength; i++) {
    const oldNode = prev[i]
    const newNode = newNodes[i]

    if (!oldNode) {
      parent.appendChild(newNode)
    } else if (!newNode) {
      parent.removeChild(oldNode)
    } else if (isSameNode(oldNode, newNode)) {
      if (oldNode.nodeType === Node.ELEMENT_NODE) {
        diffAttributes(oldNode as Element, newNode as Element)
        if (XElement.knownElements.has((oldNode as Element).tagName)) {
          const asXel = oldNode as XElement
          XElement.resetStateCounter(asXel)
          diffAndPatch(oldNode, oldNode.childNodes, asXel.render())
        } else {
          diffAndPatch(
            oldNode,
            oldNode.childNodes,
            Array.from(newNode.childNodes)
          )
        }
      } else if (oldNode.nodeType === Node.TEXT_NODE) {
        if (oldNode.textContent !== newNode.textContent) {
          oldNode.textContent = newNode.textContent
        }
      }
    } else {
      parent.replaceChild(newNode, oldNode)
    }
  }
}

function isSameNode(a: Node, b: Node): boolean {
  return (
    a.nodeType === b.nodeType &&
    ((a.nodeType === Node.ELEMENT_NODE &&
      (a as Element).tagName === (b as Element).tagName) ||
      a.nodeType === Node.TEXT_NODE)
  )
}

function diffAttributes(oldEl: Element, newEl: Element) {
  const oldAttrs = new Set<string>()
  for (const { name, value } of Array.from(newEl.attributes)) {
    oldAttrs.add(name)
    if (oldEl.getAttribute(name) !== value) {
      oldEl.setAttribute(name, value)
    }
  }
  for (const { name } of Array.from(oldEl.attributes)) {
    if (!oldAttrs.has(name)) {
      oldEl.removeAttribute(name)
    }
  }
}
