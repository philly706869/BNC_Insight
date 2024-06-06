import {} from "./components/app.js";

const html = await fetch("/static/page/index.html").then((data) => data.text());

customElements.define(
  "x-index",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;
    }
  }
);
