import { Component } from "../js/component.js";
import {} from "./components/app.js";
import {} from "./components/modal.js";

customElements.define(
  "x-index",
  class extends Component {
    static url = import.meta.url;

    onCreate(shadowRoot, internals) {}
  }
);
