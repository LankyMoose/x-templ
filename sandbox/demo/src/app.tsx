import "./components/counter"
import { defineElement, html } from "x-templ"

defineElement("x-app", {
  render() {
    return html`
      <div
        class="min-h-screen flex flex-col gap-20 justify-between px-10 py-20"
      >
        <h1
          class="text-3xl md:text-4xl md:leading-normal font-bold text-center"
        >
          X-Templ Demo
        </h1>
        ${html`<x-counter />`}
        <div class="text-center text-stone-200">
          <p>Learn at</p>
          <div class="flex gap-4 text-xl w-full justify-center">
            <a
              href="https://kaioken.dev"
              target="_blank"
              class="font-semibold flex items-center gap-1 w-full justify-center"
            >
              <img class="w-5 h-5" src="/favicon.svg" alt="kaioken logo" />
              kaioken.dev
            </a>
          </div>
        </div>
      </div>
    `
  },
})
