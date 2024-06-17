import { Component, fetchHTML } from "../js/component.js";
import {} from "./components/app.js";
import {} from "./components/modal.js";

const html = await fetchHTML(import.meta.url);

customElements.define(
  "x-index",
  class extends Component {
    constructor() {
      super();
      const { shadowRoot, internals } = this.init(html);
    }
  }
);
