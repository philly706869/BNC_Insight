import {} from "./components/account/panel.js";
import {} from "./components/account/slide.js";
import {} from "./components/app.js";

const html = await fetch("/static/page/signup.html").then((data) =>
  data.text()
);

customElements.define(
  "x-signup",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      const panel = shadowRoot.querySelector("#panel");

      const authTokenSlide = panel.querySelector("#auth-token-slide");
      const idSlide = panel.querySelector("#id-slide");
      const passwordSlide = panel.querySelector("#password-slide");
      const passwordConfirmSlide = panel.querySelector(
        "#password-confirm-slide"
      );
      const nameSlide = panel.querySelector("#name-slide");

      let authToken;
      let id;
      let password;
      let name;

      authTokenSlide.addEventListener("submit", async () => {
        const value = authTokenSlide.value;

        const validation = await fetch("/api/validate/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: value }),
        }).then((res) => res.json());

        if (!validation.valid) {
          authTokenSlide.throwError("Invalid token.");
          return;
        }

        authToken = value;
        panel.nextSlide();
      });

      idSlide.addEventListener("submit", async () => {
        const value = idSlide.value;

        const validation = await fetch("/api/validate/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: value }),
        }).then((res) => res.json());

        if (!validation.valid) {
          idSlide.throwErrors(validation.messages);
          return;
        }

        if (validation.exists) {
          idSlide.throwError("ID already exists.");
          return;
        }

        id = value;
        panel.nextSlide();
      });

      passwordSlide.addEventListener("submit", async () => {
        const value = passwordSlide.value;

        const validation = await fetch("/api/validate/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: value }),
        }).then((res) => res.json());

        if (!validation.valid) {
          passwordSlide.throwErrors(validation.messages);
          return;
        }

        password = value;
        panel.nextSlide();
      });

      passwordConfirmSlide.addEventListener("submit", () => {
        const passwordConfirm = passwordConfirmSlide.value;

        if (password !== passwordConfirm) {
          passwordConfirmSlide.throwError("Password does not match.");
          return;
        }

        panel.nextSlide();
      });

      nameSlide.addEventListener("submit", async () => {
        const value = nameSlide.value;

        const validation = await fetch("/api/validate/name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: value }),
        }).then((res) => res.json());

        if (!validation.valid) {
          nameSlide.throwErrors(validation.messages);
          return;
        }

        name = value;

        const res = await fetch("/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authToken,
            id,
            password,
            name,
          }),
        });

        if (!res.ok) {
          alert("Unknown Error. Sign up failed.");
          return;
        }

        await fetch("/user/log", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            password,
          }),
        });

        window.location.replace("/");
      });
    }
  }
);
