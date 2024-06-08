import {} from "./components/app.js";
import {} from "./components/modal.js";

const html = await fetch("/static/page/index.html").then((data) => data.text());

customElements.define(
  "x-index",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      const modalButton = shadowRoot.querySelector("#modal-button");
      modalButton.addEventListener("click", () => {
        const modal = document.createElement("template");
        modal.innerHTML = `
        <x-modal>
          <style>
            div {
              width: 100px;
              height: 100px;
              background-color: green;
            }
          </style>
          <div></div>
        </x-modal>
        `;
        document.querySelector("body").append(modal.content);
      });
    }
  }
);
