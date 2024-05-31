import { Component, fetchHTML } from "../../js/component-core.js";

const html = await fetchHTML("/static/components/account/main.html");

customElements.define(
  "wcpnt-account-main",
  class extends Component {
    constructor() {
      super(html);
    }
  }
);
