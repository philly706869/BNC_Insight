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
      const firstSlide = this.#slides[this.#index];
      firstSlide.toggleAttribute("display", true);
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
      const oldSlide = this.#slides[this.#index];
      this.#index += 1;
      const newSlide = this.#slides[this.#index];
      oldSlide.disappear();
      newSlide.appear();
    }
  }
);
