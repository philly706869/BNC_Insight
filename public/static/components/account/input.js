import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/input.html");

customElements.define(
  "wcpnt-input",
  class extends Component {
    #input;
    #placeholder;

    constructor() {
      super(html);

      this.#input = this.shadowRoot.getElementById("input");
      this.#placeholder = this.shadowRoot.getElementById("placeholder");
    }

    static observedAttributes = ["password-mode", "autofocus", "placeholder"];

    onUpdate(name, oldValue, newValue) {
      switch (name) {
        case "password-mode":
          this.#input.setAttribute(
            "type",
            this.hasAttribute("password-mode") ? "password" : "text"
          );
          break;
        case "autofocus":
          this.#input.setAttribute("autofocus", newValue);
          break;
        case "placeholder":
          this.#placeholder.textContent = newValue;
          break;
      }
    }
  }
);
