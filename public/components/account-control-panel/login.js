import $ from "jquery";
import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";
import {} from "./panel.js";
import {} from "./slide.js";

createComponent(
  import.meta.url,
  (Component) =>
    class LoginPanel extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $panel = $$("#panel");

        const $idSlide = $panel.find("#id-slide");
        const $passwordSlide = $panel.find("#password-slide");

        let id;

        $idSlide.on("submit", async () => {
          const value = $idSlide.prop("value");

          const validation = await fetch("/api/validate/id", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: value }),
          }).then((res) => res.json());

          if (!validation.exists) {
            $idSlide.triggerHandler("error", ["Wrong ID."]);
            return;
          }

          id = value;
          $panel.triggerHandler("nextSlide");
        });

        $passwordSlide.on("submit", async () => {
          const password = $passwordSlide.prop("value");

          const res = await fetch("/user/log", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, password }),
          });

          if (!res.ok) {
            $passwordSlide.triggerHandler("error", ["Wrong password."]);
            return;
          }

          const $modal = $this.closest("x-modal");
          $modal.fadeOut(200, () => $modal.trigger("close", [true]));
        });

        $this.on("focusPanel", (event) => {
          if (event.target !== this) return;
          $panel.triggerHandler("focusSlide");
        });
      }
    }
);
