export let componentPrefix = "x";

export const defineComponent = async (name, component) => {
  const html = await fetch(`./${name}.html`).then((data) => data.text());

  customElements.define(
    `${componentPrefix}-${name}`,
    class extends HTMLElement {
      #instance;

      constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.innerHTML = html;

        const internals = this.attachInternals();

        this.#instance = component(this, shadowRoot, internals);
      }

      connectedCallback() {
        this.#instance.onConnect(this);
      }

      disconnectedCallback() {
        this.#instance.onDisconnect(this);
      }

      adoptedCallback() {
        this.#instance.onAdopted(this);
      }

      attributeChangedCallback(name, oldValue, newValue, namespace) {
        this.#instance.onAttributeUpdate(
          this,
          name,
          oldValue,
          newValue,
          namespace
        );
      }

      static get observedAttributes() {
        return component.observedAttributes;
      }
    }
  );
};
