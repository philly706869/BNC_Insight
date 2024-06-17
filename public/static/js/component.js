export const fetchHTML = (importURL) =>
  fetch(`${importURL.slice(0, importURL.lastIndexOf("."))}.html`).then((data) =>
    data.text()
  );

export class Component extends HTMLElement {
  constructor() {
    super();
  }

  init(html) {
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.innerHTML = html;
    const internals = this.attachInternals();
    return { shadowRoot, internals };
  }

  onConnect() {}
  onDisconnect() {}
  onAdopted() {}
  onAttributeUpdate(name, oldValue, newValue, namespace) {}

  connectedCallback() {
    this.onConnect();
  }
  disconnectedCallback() {
    this.onDisconnect();
  }
  adoptedCallback() {
    this.onAdopted();
  }
  attributeChangedCallback(name, oldValue, newValue, namespace) {
    this.onAttributeUpdate(name, oldValue, newValue, namespace);
  }
}
