import $ from "jquery";

export function createJQuerySelector(shadowRoot) {
  return function (query) {
    return $(shadowRoot.querySelectorAll(query));
  };
}
