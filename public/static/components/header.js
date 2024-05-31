import { Component, fetchHTML } from "../js/component-core.js";

const html = await fetchHTML("/static/components/header.html");

customElements.define(
  "wcpnt-header",
  class extends Component {
    constructor() {
      super(html);
    }
  }
);
