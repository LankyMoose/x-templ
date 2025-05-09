import "./components/counter"
import { defineElement, html } from "x-templ"

defineElement("x-app", {
  shadow: { mode: "open" },
  observedAttributes: ["greeting"],
  render() {
    const onclick = () => {
      const current = this.getAttribute("greeting")
      const next = current === "Hello" ? "World" : "Hello"
      this.setAttribute("greeting", next)
    }

    return html`
      <div class="min-h-screen flex flex-col gap-20 justify-center px-10 py-20">
        <h1
          onclick="${onclick}"
          class="text-3xl md:text-4xl md:leading-normal font-bold text-center"
        >
          X-Templ Demo ${this.$attribute("greeting")}
        </h1>
        <slot name="footer"></slot>
        ${html`<x-counter />`}
      </div>
    `
  },
})
