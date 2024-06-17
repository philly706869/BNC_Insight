import { Component, fetchHTML } from "../../js/component.js";
import {} from "./header.js";

const html = await fetchHTML(import.meta.url);

customElements.define(
  "x-app",
  class extends Component {
    constructor() {
      super();
      const { shadowRoot, internals } = this.init(html);
    }
  }
);
