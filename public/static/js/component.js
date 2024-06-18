export class ComponentManager {
  prefix;

  constructor(prefix) {
    this.prefix = prefix;
  }

  async createComponent(importURL, constructor) {
    const htmlURL = `${importURL.slice(0, importURL.lastIndexOf("."))}.html`;
    const html = await fetch(htmlURL).then((data) => data.text());

    const protectedMap = {};

    class Component extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.innerHTML = html;
        const internals = this.attachInternals();
        protectedMap[this] = { shadowRoot, internals };
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

    const getProtectedProps = (customComponent) =>
      protectedMap[customComponent];

    const CustomComponent = constructor(Component, getProtectedProps);

    const name = `${this.prefix}-${CustomComponent.name
      .replace(/^[A-Z]/, (char) => char.toLowerCase())
      .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

    customElements.define(name, CustomComponent);
  }
}

export const defaultComponentManager = new ComponentManager("x");
export const createComponent = defaultComponentManager.createComponent.bind(
  defaultComponentManager
);
