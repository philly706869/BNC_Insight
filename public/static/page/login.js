import {} from "./components/account/input.js";
import {} from "./components/account/panel.js";
import {} from "./components/account/slide.js";
import {} from "./components/app.js";
import {} from "./components/header.js";

const html = await fetch("/static/page/login.html").then((data) => data.text());

customElements.define(
  "x-login",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

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

        window.location.replace("/");
      });
    }
  }
);
