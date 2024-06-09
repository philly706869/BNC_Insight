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
    }
  }
);
