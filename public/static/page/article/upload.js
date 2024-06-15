import { markdownToHTML } from "../../js/markdownToHTML.js";
import {} from "../components/app.js";
import {} from "../components/input.js";

const html = await fetch("/static/page/article/upload.html").then((data) =>
  data.text()
);

customElements.define(
  "x-article-upload",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      const markdownArea = shadowRoot.querySelector("#markdown-area");
      const previewArea = shadowRoot.querySelector("#preview-area");

      markdownArea.addEventListener("input", () => {
        previewArea.innerHTML = markdownToHTML(markdownArea.value);
      });
    }
  }
);
