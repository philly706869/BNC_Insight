export class Component extends HTMLElement {
  #shadowRoot;
  get shadowRoot() {
    return this.#shadowRoot;
  }

  onMount() {}
  onDismount() {}
  onAdopted() {}
  onUpdate() {}

  constructor(template) {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "closed" });
    this.#shadowRoot.innerHTML = template;
  }

  connectedCallback() {
    this.onMount();
  }

  disconnectedCallback() {
    this.onDismount();
  }

  adoptedCallback() {
    this.onAdopted();
  }

  attributeChangedCallback() {
    this.onUpdate();
  }
}
