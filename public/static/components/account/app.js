import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/app.html");

customElements.define(
  "wcpnt-account-app",
  class extends Component {
    #title;

    constructor() {
      super(html);

      this.#title = this.shadowRoot.getElementById("title");
    }

    static observedAttributes = ["title"];

    onUpdate(name, oldValue, newValue) {
      switch (name) {
        case "title":
          this.#title.textContent = newValue;
          break;
      }
    }
  }
);
