import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/app.html");

customElements.define(
  "wcpnt-account-app",
  class extends Component {
    constructor() {
      super(html);

      const title = this.shadowRoot.getElementById("title");
      title.textContent = this.getAttribute("title") || "";
    }
  }
);
