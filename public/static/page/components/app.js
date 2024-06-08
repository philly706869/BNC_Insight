import {} from "./header.js";

const html = await fetch("/static/page/components/app.html").then((data) =>
  data.text()
);

customElements.define(
  "x-app",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;
    }
  }
);
