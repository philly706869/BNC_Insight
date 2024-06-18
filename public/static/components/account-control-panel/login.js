import { createComponent } from "../../js/component.js";
import {} from "./panel.js";
import {} from "./slide.js";

createComponent(
  import.meta.url,
  (Component, getProtectedProps) =>
    class LoginPanel extends Component {
      constructor() {
        super();
        const { shadowRoot, internals } = getProtectedProps(this);

        const modal = this.closest("x-modal");

        const panel = shadowRoot.querySelector("#panel");

        const idSlide = panel.querySelector("#id-slide");
        const passwordSlide = panel.querySelector("#password-slide");

        let id;

        idSlide.addEventListener("submit", async () => {
          const value = idSlide.value;

          const validation = await fetch("/api/validate/id", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: value }),
          }).then((res) => res.json());

          if (!validation.exists) {
            idSlide.throwError("Wrong ID.");
            return;
          }

          id = value;
          panel.nextSlide();
        });

        passwordSlide.addEventListener("submit", async () => {
          const password = passwordSlide.value;

          const res = await fetch("/user/log", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, password }),
          });

          if (!res.ok) {
            passwordSlide.throwError("Wrong password.");
            return;
          }

          modal.close(true);
        });

        this.replaceWith(...shadowRoot.childNodes);

        idSlide.focus();
      }
    }
);
