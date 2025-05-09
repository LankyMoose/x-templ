import "./global.css"
import "./app"

document.querySelector("#app")!.innerHTML = `
  <x-app greeting="Hello">
    <span slot="footer">Footer from parent</span>
  </x-app>
`
