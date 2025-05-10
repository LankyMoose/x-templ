# **x-templ**

#### _A small library for creating Web Components that are declarative and reactive._

<br />

### General Usage

```html
<x-app greeting="Hello world!" />
```

```ts
import { defineElement, html, $reactive, $inert } from "x-templ"

defineElement("x-app", {
  observedAttributes: ["greeting"],
  state: () => ({
    count: $reactive(0),
    toggled: $inert(false),
  }),
  render() {
    const { count, toggled } = this.$state()
    const increment = () => {
      /**
       * $reactive values will trigger an update when they change
       */
      count.set((prev) => prev + 1)
    }
    const toggle = () => {
      /**
       * $inert values won't trigger an update when they change,
       * but you can manually trigger an update with `this.update()`
       */
      toggled.current = !toggled.current
      this.update()
    }

    return html`
      <h1 class="text-xl">${this.getAttribute("greeting")}</h1>
      <button onclick="${toggle}">Toggle</button>
      ${toggled.get()
        ? html`<x-counter onIncrement="${increment}" count="${count.get()}" />`
        : ""}
    `
  },
})

defineElement("x-counter", {
  observedAttributes: ["count"],
  onMounted() {
    console.log("mounted!", this.getAttribute("count"))
    return () => console.log("unmounted!")
  }
  onAttributeChanged(name, oldValue, newValue) {
    /**
     * we automatically update when attributes change,
     * but you can use this to 'listen' for changes as well
     */
    console.log(name, oldValue, newValue)
  }
  render() {
    return html`
      <button onclick="${() => this.$emit("increment")}">
        Nested Counter: ${this.getAttribute("count")}
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
  state: () => ({ count: $reactive(0) }),
  render() {
    const { count } = this.$state()
    const increment = () => count.set((prev) => prev + 1)

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
