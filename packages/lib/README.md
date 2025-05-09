# **x-templ**

#### _A small library for creating Web Components that are declarative and reactive._

<br />

### Usage

```html
<x-app greeting="Hello world!" />
```

```ts
import { defineWebComponent, html } from "x-templ"

defineWebComponent("x-app", {
  observedAttributes: ["greeting"],
  render: function () {
    const toggled = this.$state(false)
    const count = this.$state(0)
    const greeting = this.$attribute("greeting", "Hello world!")

    const increment = () => count.set(count.get() + 1)

    return html`
      <h1 class="text-xl">${greeting}</h1>
      <button onclick="${() => toggled.set(!toggled.get())}">Toggle</button>
      ${toggled.get()
        ? html`<x-nested onIncrement="${increment}" count="${count.get()}" />`
        : ""}
    `
  },
})

defineWebComponent("x-nested", {
  observedAttributes: ["count"],
  render: function () {
    const count = this.$attribute("count")
    return html`
      <button onclick="${() => this.$emit("increment")}">
        Nested Counter: ${count}
      </button>
      <x-nested-again />
    `
  },
})
```
