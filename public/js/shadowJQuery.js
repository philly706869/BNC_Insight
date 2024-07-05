import $ from "jquery";

export function createShadowJQuery(shadowRoot) {
  return function (query) {
    return $(shadowRoot.querySelectorAll(query));
  };
}
