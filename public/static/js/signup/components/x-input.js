class XInput extends Element {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.innerHTML = `
    <div id="wrapper">
      <input
        id="input"
        type="text"
        autocomplete="off"
        title="Please enter your ID."
      />
      <label id="placeholder" for="input">ID</label>
    </div>
    <label id="error-field" for="input" hidden></label>
    `;
  }
}

customElements.define("x-input", XInput);
