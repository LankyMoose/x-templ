import { defineElement, html } from "x-templ"

defineElement("x-counter", {
  render() {
    const animation = this.$ref<Animation | null>(null)
    const count = this.$state(0)

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
