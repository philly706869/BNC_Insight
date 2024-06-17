export class Component extends HTMLElement {
  static #htmls = {};

  constructor() {
    super();

    const importURL = this.constructor.url;

    if (!(importURL in Component.#htmls)) {
      const htmlURL = `${importURL.slice(0, importURL.lastIndexOf("."))}.html`;
      Component.#htmls[importURL] = fetch(htmlURL).then((data) => data.text());
    }

    (async () => {
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = await Component.#htmls[importURL];
      const internals = this.attachInternals();
      this.onCreate(shadowRoot, internals);
    })();
  }

  onCreate(shadowRoot, internals) {}
  onConnect() {}
  onDisconnect() {}
  onAdopted() {}
  onAttributeUpdate(name, oldValue, newValue) {}
}
