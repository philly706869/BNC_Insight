const html = await fetch("/static/components/header.html").then((data) =>
  data.text()
);

customElements.define(
  "wcpnt-header",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;
    }
  }
);
