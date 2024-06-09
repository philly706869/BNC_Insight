const html = await fetch("/static/page/components/account/panel.html").then(
  (data) => data.text()
);

customElements.define(
  "x-account-panel",
  class extends HTMLElement {
    #title;
    #slides;
    #index = 0;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      this.#title = shadowRoot.getElementById("title");
      this.#slides = this.children;
      for (const slide of this.#slides) {
        slide.toggleAttribute("hidden", true);
      }
      const firstSlide = this.#slides[this.#index];
      firstSlide.toggleAttribute("hidden", false);
    }

    static observedAttributes = ["title"];

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "title":
          this.#title.textContent = newValue;
          break;
      }
    }

    nextSlide() {
      if (this.#index >= this.#slides.length - 1) return;
      this.#slides[this.#index].toggleAttribute("hidden", true);
      this.#index += 1;
      const currentSlide = this.#slides[this.#index];
      currentSlide.toggleAttribute("hidden", false);
      currentSlide.focusInput();
    }
  }
);
