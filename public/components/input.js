import $ from "jquery";
import { createComponent } from "../js/component.js";

createComponent(
  (Component) =>
    class Input extends Component {
      #$input;
      #$placeholder;

      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              :host {
                height: 50px;
                display: block;
                position: relative;
                margin-top: 4px;
              }
            
              #input {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid silver;
                border-radius: 3px;
                padding: 0 10px;
                font-size: large;
              }
            
              #input:focus {
                border-color: black;
                outline: none;
              }
            
              #input[error] {
                border: 2px solid var(--red);
              }
            
              #placeholder {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                padding: 0 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                transition: 0.2s;
                transition-timing-function: ease cubic-bezier(0.25, 0.1, 0.25, 1);
                background-color: white;
                color: rgba(0, 0, 0, 0.5);
                font-size: large;
              }
            
              #input:focus + #placeholder,
              #input:valid + #placeholder {
                top: 0px;
                font-size: small;
                color: rgba(0, 0, 0, 0.9);
              }
            </style>
            <input id="input" autocomplete="off" spellcheck="false" required />
            <label id="placeholder" for="input"></label>
          `
        );

        const $input = $shadow.find("#input");
        const $placeholder = $shadow.find("#placeholder");

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
