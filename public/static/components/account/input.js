const html = await fetch("/static/components/account/input.html").then((data) =>
  data.text()
);

customElements.define(
  "wcpnt-input",
  class extends HTMLElement {
    #input;
    #placeholder;

    static formAssociated = true;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      this.#input = shadowRoot.getElementById("input");
      this.#placeholder = shadowRoot.getElementById("placeholder");

      this.#input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.dispatchEvent(new CustomEvent("enter", event));
        }
      });
    }

    static observedAttributes = ["password-mode", "placeholder", "error"];

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "password-mode":
          this.#input.setAttribute(
            "type",
            this.hasAttribute("password-mode") ? "password" : "text"
          );
          break;
        case "placeholder":
          this.#placeholder.textContent = newValue;
          break;
        case "error":
          this.#input.toggleAttribute("error", this.hasAttribute("error"));
          break;
      }
    }

    get value() {
      return this.#input.value;
    }

    focus() {
      this.#input.focus();
    }
  }
);
