import { Component, fetchHTML } from "../../../js/component.js";

const html = await fetchHTML(import.meta.url);

customElements.define(
  "x-account-panel",
  class extends Component {
    #title;
    #slides;
    #index = 0;

    constructor() {
      super();
      const { shadowRoot, internals } = this.init(html);

      const closeButton = shadowRoot.querySelector("#close-button");
      closeButton.addEventListener("click", () => {
        this.closest("x-modal").close(false);
      });

      this.#title = shadowRoot.getElementById("title");
      this.#slides = this.children;
      const firstSlide = this.#slides[this.#index];
      firstSlide.toggleAttribute("display", true);
    }

    static observedAttributes = ["title"];

    onAttributeUpdate(name, oldValue, newValue) {
      switch (name) {
        case "title":
          this.#title.textContent = newValue;
          break;
      }
    }

    nextSlide() {
      if (this.#index >= this.#slides.length - 1) return;
      const oldSlide = this.#slides[this.#index];
      this.#index += 1;
      const newSlide = this.#slides[this.#index];
      oldSlide.disappear();
      newSlide.appear();
    }
  }
);
