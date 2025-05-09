# **x-templ**

#### _A small library for creating Web Components that are declarative and reactive._

<br />

### General Usage

```html
<x-app greeting="Hello world!" />
```

```ts
import { defineElement, html } from "x-templ"

defineElement("x-app", {
  observedAttributes: ["greeting"],
  render: function () {
    const toggled = this.$state(false)
    const count = this.$state(0)
    const increment = () => count.set(count.get() + 1)

    return html`
      <h1 class="text-xl">${this.$attribute("greeting")}</h1>
      <button onclick="${() => toggled.set(!toggled.get())}">Toggle</button>
      ${toggled.get()
        ? html`<x-counter onIncrement="${increment}" count="${count.get()}" />`
        : ""}
    `
  },
})

defineElement("x-counter", {
  observedAttributes: ["count"],
  render: function () {
    const count = this.$attribute("count")

    return html`
      <button onclick="${() => this.$emit("increment")}">
        Nested Counter: ${count}
      </button>
    `
  },
})
```

### Shadow DOM & `<slot>`

```html
<x-app>
  <span slot="greeting">Hello world!</span>
</x-app>
```

```ts
import { defineElement, html } from "x-templ"

defineElement("x-app", {
  shadow: { mode: "open" },
  render: function () {
    const count = this.$state(0)
    const increment = () => count.set(count.get() + 1)

    return html`
      <style>
        :host {
          display: block;
        }
        h1 {
          color: crimson;
          cursor: pointer;
        }
      </style>
      <h1 class="text-xl">
        <slot name="greeting"></slot>
      </h1>
      <button onclick="${increment}">Count: ${count.get()}</button>
    `
  },
})
```
