import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/input.html");

customElements.define(
  "wcpnt-input",
  class extends Component {
    constructor() {
      super(html);

      const placeholder = this.shadowRoot.getElementById("placeholder");
      placeholder.textContent = this.getAttribute("placeholder") || "";
    }
  }
);
