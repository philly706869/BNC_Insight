import { marked } from "../../js/external/marked.js";
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

      const markdownTextArea = shadowRoot.querySelector(
        "#markdown-area > textarea"
      );
      const previewArea = shadowRoot.querySelector("#preview-area");

      markdownTextArea.addEventListener("input", () => {
        const markdown = markdownTextArea.value;
        previewArea.innerHTML = marked.parse(markdown);
      });
    }
  }
);
