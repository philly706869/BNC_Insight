import $ from "jquery";

export const createJQuerySelector = (shadowRoot) => (query) =>
  $(shadowRoot.querySelectorAll(query));
