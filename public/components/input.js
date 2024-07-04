import $ from "jquery";
import { createComponent } from "../js/component.js";
import { createJQuerySelector } from "../js/shadowJQuery.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Input extends Component {
      #$input;
      #$placeholder;

      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $input = $$("#input");
        const $placeholder = $$("#placeholder");

        $input.on("keypress", (event) => {
          if (event.key === "Enter") {
            $this.triggerHandler("enter");
          }
        });

        $this.on("focus", (event) => {
          if (event.target !== this) return;
          $input.trigger("focus");
        });

        this.#$input = $input;
        this.#$placeholder = $placeholder;
      }

      static observedAttributes = [
        "password-mode",
        "placeholder",
        "error",
        "maxlength",
      ];

      onAttributeUpdate(name, oldValue, newValue) {
        const $this = $(this);
        const $input = this.#$input;
        const $placeholder = this.#$placeholder;

        switch (name) {
          case "password-mode":
            $input.attr(
              "type",
              $this.is("[password-mode]") ? "password" : "text"
            );
            break;
          case "placeholder":
            $placeholder.text(newValue);
            break;
          case "error":
            switch ($this.is("[error]")) {
              case true:
                $input.attr("error", "");
                break;
              case false:
                $input.removeAttr("error");
                break;
            }
            break;
          case "maxlength":
            $input.attr("maxlength", newValue);
        }
      }

      get value() {
        return this.#$input.val();
      }
    }
);
