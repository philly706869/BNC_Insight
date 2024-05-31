export class Component extends HTMLElement {
  #shadowRoot;
  get shadowRoot() {
    return this.#shadowRoot;
  }

  onMount() {}
  onDismount() {}
  onAdopted() {}
  onUpdate() {}

  constructor(html) {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "closed" });
    this.#shadowRoot.innerHTML = html;
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

  attributeChangedCallback(name, oldValue, newValue) {
    this.onUpdate(name, oldValue, newValue);
  }
}

export const fetchHTML = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`status not ok GET ${url}`);
  const html = await res.text();
  return html;
};
