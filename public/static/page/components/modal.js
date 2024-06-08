const html = await fetch("/static/page/components/modal.html").then((data) =>
  data.text()
);

customElements.define(
  "x-modal",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      this.#open();

      this.addEventListener("click", (event) => {
        if (event.target === this) this.close();
      });
    }

    #open() {
      const handler = ((event) => {
        if (event.target !== this) return;
        this.removeEventListener("animationend", handler);
        this.removeAttribute("state");
      }).bind(this);
      this.addEventListener("animationend", handler);
      this.setAttribute("state", "opening");
    }

    close() {
      const handler = ((event) => {
        if (event.target !== this) return;
        this.removeEventListener("animationend", handler);
        this.parentElement.removeChild(this);
      }).bind(this);
      this.addEventListener("animationend", handler);
      this.setAttribute("state", "closing");
    }
  }
);
