import { createComponent } from "../../js/component.js";
import {} from "../input.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Slide extends Component {
      #input;
      #error;
      #submit;

      constructor(protectedProps) {
        super(protectedProps);
        const { shadowRoot } = protectedProps;

        this.#input = shadowRoot.getElementById("input");
        this.#error = shadowRoot.getElementById("error");
        this.#submit = shadowRoot.getElementById("submit");

        this.#input.addEventListener("input", () => {
          this.resolveError();
        });

        const handler = (event) => {
          this.dispatchEvent(new Event("submit", event));
        };

        this.#input.addEventListener("enter", handler);
        this.#submit.addEventListener("click", handler);

        this.dispatchEvent(new CustomEvent("loaded"));
      }

      static observedAttributes = [
        "title",
        "placeholder",
        "password-mode",
        "button-text",
        "error",
      ];

      onAttributeUpdate(name, oldValue, newValue) {
        switch (name) {
          case "title":
            this.#input.setAttribute("title", newValue);
            break;
          case "placeholder":
            this.#input.setAttribute("placeholder", newValue);
            break;
          case "password-mode":
            this.#input.setAttribute("password-mode", newValue);
            break;
          case "button-text":
            this.#submit.textContent = newValue;
            break;
        }
      }

      get value() {
        return this.#input.value || "";
      }

      async appear() {
        const handler = () => {
          this.removeEventListener("animationend", handler);
          this.toggleAttribute("move", false);
          this.focus();
        };
        this.addEventListener("animationend", handler);
        this.toggleAttribute("display", true);
        this.toggleAttribute("move", true);
      }

      async disappear() {
        const handler = () => {
          this.removeEventListener("animationend", handler);
          this.toggleAttribute("display", false);
          this.toggleAttribute("move", false);
        };
        this.addEventListener("animationend", handler);
        this.toggleAttribute("move", true);
      }

      #setErrorState(state) {
        this.#input.toggleAttribute("error", state);
        this.#error.toggleAttribute("hidden", !state);
      }

      throwError(error) {
        this.#setErrorState(true);
        this.#error.textContent = error;
      }

      throwErrors(errors) {
        this.#setErrorState(true);
        this.#error.textContent = errors.join("\n");
      }

      resolveError() {
        this.#setErrorState(false);
        this.#error.textContent = "";
      }

      focus() {
        this.#input.focus();
      }
    }
);
