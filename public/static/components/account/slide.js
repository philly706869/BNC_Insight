const html = await fetch("/static/components/account/slide.html").then((data) =>
  data.text()
);

customElements.define(
  "wcpnt-slide",
  class extends HTMLElement {
    #input;
    #error;
    #submit;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      this.#input = shadowRoot.getElementById("input");
      this.#error = shadowRoot.getElementById("error");
      this.#submit = shadowRoot.getElementById("submit");

      const handler = (event) => {
        this.dispatchEvent(new Event("submit", event));
      };

      this.#input.addEventListener("enter", handler);
      this.#submit.addEventListener("click", handler);

      this.dispatchEvent(new CustomEvent("load"));
    }

    static observedAttributes = [
      "title",
      "placeholder",
      "password-mode",
      "button-text",
      "error",
    ];

    attributeChangedCallback(name, oldValue, newValue) {
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
        case "button-text":
          this.#submit.textContent = newValue;
          break;
        case "error":
          this.#input.toggleAttribute("error", newValue);
          this.#error.toggleAttribute("hidden", !newValue);
          this.#error.textContent = newValue;
          break;
      }
    }

    get value() {
      return this.#input.value || "";
    }

    focusInput() {
      this.#input.focus();
    }
  }
);
