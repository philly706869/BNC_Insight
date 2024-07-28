import $ from "jquery";

export class Component extends HTMLElement {
  constructor(protectedProps = {}) {
    super();
    const shadowRoot = this.attachShadow({ mode: `closed` });
    const internals = this.attachInternals();
    protectedProps.shadowRoot = shadowRoot;
    protectedProps.internals = internals;
    protectedProps.$this = $(this);
    protectedProps.$shadow = $(shadowRoot);
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

export class ComponentManager {
  prefix;

  constructor(prefix) {
    this.prefix = prefix;
  }

  async registerComponent(Component) {
    class ComponentConstructor extends Component {
      constructor() {
        super({});
      }
    }

    const name = `${this.prefix}-${Component.name
      .replace(/^[A-Z]/, (char) => char.toLowerCase())
      .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

    customElements.define(name, ComponentConstructor);
  }
}

export const defaultComponentManager = new ComponentManager(`x`);
export function registerComponent(...args) {
  return defaultComponentManager.registerComponent(...args);
}
