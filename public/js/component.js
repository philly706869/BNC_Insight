export class ComponentManager {
  prefix;

  constructor(prefix) {
    this.prefix = prefix;
  }

  async createComponent(importURL, constructor) {
    const htmlURL = `${importURL.slice(0, importURL.lastIndexOf("."))}.html`;
    const html = await fetch(htmlURL).then((data) => data.text());

    class ComponentAncestor extends HTMLElement {
      constructor(protectedProps) {
        super();
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.innerHTML = html;
        const internals = this.attachInternals();
        protectedProps.shadowRoot = shadowRoot;
        protectedProps.internals = internals;
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

    class Component extends constructor(ComponentAncestor) {
      constructor() {
        super({});
      }
    }

    const name = `${this.prefix}-${constructor(null)
      .name.replace(/^[A-Z]/, (char) => char.toLowerCase())
      .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

    customElements.define(name, Component);
  }
}

export const defaultComponentManager = new ComponentManager("x");
export function createComponent(...args) {
  return defaultComponentManager.createComponent(...args);
}
