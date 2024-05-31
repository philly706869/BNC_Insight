import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/slide.html");

customElements.define(
  "wcpnt-slide",
  class extends Component {
    #input;
    #error;
    #submitButton;

    constructor() {
      super(html);

      this.#input = this.shadowRoot.getElementById("input");
      this.#error = this.shadowRoot.getElementById("error");
      this.#submitButton = this.shadowRoot.getElementById("submit-button");
    }

    static observedAttributes = [
      "title",
      "placeholder",
      "password-mode",
      "autofocus",
      "button-text",
      "error",
    ];

    onUpdate(name, oldValue, newValue) {
      switch (name) {
        case "title":
          this.#input.setAttribute("title", newValue);
          break;
        case "placeholder":
          this.#input.setAttribute("placeholder", newValue);
          break;
        case "password-mode":
          this.#input.setAttribute("password-mode", newValue);
          break;
        case "autofocus":
          this.#input.setAttribute("autofocus", newValue);
          break;
        case "button-text":
          this.#submitButton.textContent = newValue;
          break;
        case "error":
          this.#input.toggleAttribute("error", newValue);
          this.#error.toggleAttribute("hidden", !newValue);
          this.#error.textContent = newValue;
          break;
      }
    }
  }
);
