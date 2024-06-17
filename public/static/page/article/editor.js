import { Component, fetchHTML } from "../../js/component.js";
import {} from "../components/input.js";

const html = await fetchHTML(import.meta.url);

customElements.define(
  "x-editor",
  class extends Component {
    constructor() {
      super();
      const { shadowRoot, internals } = this.init(html);
    }
  }
);
