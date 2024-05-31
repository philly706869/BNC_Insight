import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/slide.html");

customElements.define(
  "wcpnt-slide",
  class extends Component {
    #input;
    #submitButton;

    constructor() {
      super(html);

      this.#input = this.shadowRoot.getElementById("input");
      this.#submitButton = this.shadowRoot.getElementById("submit-button");
    }

    static observedAttributes = [
      "title",
      "placeholder",
      "password-mode",
      "autofocus",
      "button-text",
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
        case "autofocus":
          this.#input.setAttribute("autofocus", newValue);
          break;
        case "button-text":
          this.#submitButton.textContent = newValue;
          break;
      }
    }
  }
);
