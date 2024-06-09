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
        if (event.target === this) this.close(null);
      });
    }

    #open() {
      this.dispatchEvent(new CustomEvent("openingstart", { bubbles: false }));
      const handler = (event) => {
        if (event.target !== this) return;
        this.removeEventListener("animationend", handler);
        this.toggleAttribute("opening", false);
        this.dispatchEvent(new CustomEvent("openingend", { bubbles: false }));
      };
      this.addEventListener("animationend", handler);
      this.toggleAttribute("opening", true);
    }

    close(detail) {
      this.dispatchEvent(new CustomEvent("closingstart", { detail }));
      const handler = (event) => {
        if (event.target !== this) return;
        this.removeEventListener("animationend", handler);
        this.toggleAttribute("closing", false);
        this.remove();
        this.dispatchEvent(new CustomEvent("closingend", { detail }));
      };
      this.addEventListener("animationend", handler);
      this.toggleAttribute("closing", true);
    }
  }
);

export const raiseModal = async (innerHTML) => {
  const template = document.createElement("template");
  template.innerHTML = `<x-modal>${innerHTML}</x-modal>`;
  const modal = template.content.querySelector("x-modal");
  document.body.appendChild(modal);
  return new Promise((resolve) => {
    modal.addEventListener("closingend", (event) => {
      resolve(event.detail);
    });
  });
};
