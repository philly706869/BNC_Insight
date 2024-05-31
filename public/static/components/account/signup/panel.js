import { Component, fetchHTML } from "../../../js/component-core.js";

const html = await fetchHTML("/static/components/account/signup/panel.html");

customElements.define(
  "wcpnt-signup-panel",
  class extends Component {
    constructor() {
      super(html);
    }
  }
);
