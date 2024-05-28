import { Component } from "../../component.js";

const templateRequest = await fetch("/static/components/input.html");
if (!templateRequest.ok) throw new Error("failed to initialize template");
const template = await templateRequest.text();

customElements.define(
  "wcpnt-input",
  class extends Component {
    constructor() {
      super(template);
    }
  }
);
