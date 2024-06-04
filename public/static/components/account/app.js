const html = await fetch("/static/components/account/app.html").then((data) =>
  data.text()
);

customElements.define(
  "wcpnt-account-app",
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
      firstSlide.addEventListener("load", () => {
        firstSlide.focusInput();
      });
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
      if (this.#index >= this.#slides.length) return;
      this.#slides[this.#index].toggleAttribute("hidden", true);
      this.#index += 1;
      const currentSlide = this.#slides[this.#index];
      currentSlide.toggleAttribute("hidden", false);
      currentSlide.focusInput();
    }
  }
);
