import "./global.css"
import { $inert, $reactive, defineElement, html } from "x-templ"

document.querySelector("#app")!.innerHTML = `
  <x-app greeting="Hello" />
`

defineElement("x-app", {
  observedAttributes: ["greeting"],
  state: () => ({ toggled: $reactive(false) }),
  render() {
    const { toggled } = this.$state()
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
          X-Templ Demo ${this.getAttribute("greeting") ?? "Hello"}
        </h1>
        <button onclick="${() => toggled.set((v) => !v)}">Toggle</button>
        ${toggled.get()
          ? html`<x-counter
              greeting="${this.getAttribute("greeting") || ""}"
            />`
          : ""}
      </div>
    `
  },
})

defineElement("x-counter", {
  observedAttributes: ["greeting"],
  state: () => ({
    animation: $inert<Animation | null>(null),
    count: $reactive(0),
  }),
  render() {
    console.log("x-counter: render")
    const { animation, count } = this.$state()
    const handleClick = () => {
      count.set(count.get() + 1)
      animation.current?.finish()
      const text = this.querySelector("span")
      animation.current =
        text?.animate(
          [{ transform: "scale(2.5)" }, { transform: "scale(1)" }],
          {
            duration: 300,
            iterations: 1,
          }
        ) ?? null
    }

    return html`
      <div class="flex flex-col gap-8 justify-center items-center">
        ${this.getAttribute("greeting") ?? ""}
        <button type="button" onclick="${handleClick}" class="cursor-pointer">
          <img
            src="/favicon.svg"
            class="w-32 h-32 animate-pulse"
            alt="kaioken logo"
          />
        </button>
        <span class="text-4xl font-medium select-none">${count.get()}</span>
      </div>
    `
  },
})
