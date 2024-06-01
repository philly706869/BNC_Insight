import { fetchHTML } from "../js/fetchHTML.js";

const html = await fetchHTML("/static/components/header.html");

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
