import {} from "./components/account/app.js";
import {} from "./components/account/input.js";
import {} from "./components/account/slide.js";
import {} from "./components/header.js";

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

      const app = shadowRoot.querySelector("#app");

      const authTokenSlide = app.querySelector("#auth-token-slide");
      const idSlide = app.querySelector("#id-slide");
      const passwordSlide = app.querySelector("#password-slide");
      const passwordConfirmSlide = app.querySelector("#password-confirm-slide");
      const nameSlide = app.querySelector("#name-slide");

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
        app.nextSlide();
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
        app.nextSlide();
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
        app.nextSlide();
      });

      passwordConfirmSlide.addEventListener("submit", () => {
        const passwordConfirm = passwordConfirmSlide.value;

        if (password !== passwordConfirm) {
          passwordConfirmSlide.throwError("Password does not match.");
          return;
        }

        app.nextSlide();
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

        const res = await fetch("/api/signup", {
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

        window.location.replace("/");
      });
    }
  }
);
