import $ from "jquery";
import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";
import {} from "../input.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Slide extends Component {
      #$input;
      #$submit;

      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $input = $$("#input");
        const $error = $$("#error");
        const $submit = $$("#submit");

        $input.on("input", () => {
          $this.triggerHandler("resolve");
        });

        const handler = (event) => {
          $this.trigger("submit", event);
        };

        $input.on("enter", handler);
        $submit.on("click", handler);

        $this.on("appear", () => {
          const handler = () => {
            $this.off("animationend", handler);
            $this.removeAttr("move");
            $this.triggerHandler("focusInput");
          };
          $this.on("animationend", handler);
          $this.attr("display", "");
          $this.attr("move", "");
        });

        $this.on("disappear", () => {
          const handler = () => {
            $this.off("animationend", handler);
            $this.removeAttr("display");
            $this.removeAttr("move");
          };
          $this.on("animationend", handler);
          $this.attr("move", "");
        });

        $this.on("error", (_, ...errors) => {
          $input.attr("error", "");
          $error.removeAttr("hidden");
          $error.text(errors.join("\n"));
        });

        $this.on("resolve", () => {
          $input.removeAttr("error");
          $error.attr("hidden", "");
          $error.text("");
        });

        $this.on("focusInput", (event) => {
          if (event.target !== this) return;
          $input.triggerHandler("focus");
        });

        this.#$input = $input;
        this.#$submit = $submit;

        $this.triggerHandler("loaded");
      }

      static observedAttributes = [
        "title",
        "placeholder",
        "password-mode",
        "button-text",
        "error",
      ];

      onAttributeUpdate(name, oldValue, newValue) {
        const $input = this.#$input;
        const $submit = this.#$submit;

        switch (name) {
          case "title":
            $input.attr("title", newValue);
            break;
          case "placeholder":
            $input.attr("placeholder", newValue);
            break;
          case "password-mode":
            $input.attr("password-mode", newValue);
            break;
          case "button-text":
            $submit.text(newValue);
            break;
        }
      }

      get value() {
        return this.#$input.val();
      }

      set value(value) {
        this.#$input.val(value);
      }
    }
);
