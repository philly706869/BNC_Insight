import { createComponent } from "../../js/component.js";
import {} from "../input.js";

createComponent(
  (Component) =>
    class Slide extends Component {
      #$input;
      #$submit;

      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              :host {
                width: 100%;
                height: 100%;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
            
              :host(:not([display])) {
                display: none;
              }
            
              :host([move]) {
                animation: rightToLeft 0.3s;
              }
            
              @keyframes rightToLeft {
                0% {
                  transform: none;
                }
            
                100% {
                  transform: translateX(-100%);
                }
              }
            
              #error {
                display: flex;
                margin-top: 3px;
                color: var(--red);
                font-size: small;
              }
            
              #error::before {
                -webkit-mask: url("/static/img/alert.svg") no-repeat 50% 50%;
                mask: url("/static/img/alert.svg") no-repeat 50% 50%;
                -webkit-mask-size: cover;
                mask-size: cover;
                content: "";
                display: inline-block;
                height: 13px;
                width: 13px;
                background-color: var(--red);
                line-height: 50%;
                margin-right: 5px;
              }
            
              #error[hidden] {
                visibility: hidden;
              }
            
              #submit {
                width: 100%;
                height: 50px;
                border: none;
                border-radius: 3px;
                background-color: var(--regular-scarlet);
                color: white;
                font-size: large;
              }
            
              #submit:hover {
                background-color: var(--deep-scarlet);
              }
            </style>
            <div>
              <x-input id="input"></x-input>
              <label id="error" for="input" hidden></label>
            </div>
            <button id="submit"></button>
          `
        );

        const $input = $shadow.find("#input");
        const $error = $shadow.find("#error");
        const $submit = $shadow.find("#submit");

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
