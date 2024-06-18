import { createComponent } from "../js/component.js";
import {} from "./account-control-panel/login.js";
import {} from "./account-control-panel/signup.js";
import { raiseModal } from "./modal.js";

const getUser = async () => {
  const res = await fetch("/api/user");
  return res.ok ? await res.json() : null;
};

createComponent(
  import.meta.url,
  (Component, getProtectedProps) =>
    class Header extends Component {
      #userPanel;
      #articlePanel;

      constructor() {
        super();
        const { shadowRoot, internals } = getProtectedProps(this);

        const timePanel = shadowRoot.querySelector("#time-panel");
        const date = new Date();
        timePanel.textContent = date.toDateString();
        timePanel.setAttribute("datetime", date.toISOString().split("T")[0]);

        this.#userPanel = shadowRoot.querySelector("#user-panel");
        // this.#articlePanel = shadowRoot.querySelector("#article-panel");

        this.updateUser();
      }

      async updateUser() {
        const user = await getUser();

        if (user) {
          this.#userPanel.innerHTML = `
        <li><button id="user-button"></button></li>
        <li><button id="logout-button">Log Out</button></li>
        `;

          const userButton = this.#userPanel.querySelector("#user-button");
          userButton.textContent = user.name;
          userButton.addEventListener("click", () => {
            window.location.href = "/user";
          });

          const logoutButton = this.#userPanel.querySelector("#logout-button");
          logoutButton.addEventListener("click", async () => {
            await fetch("/user/log", { method: "DELETE" });
            this.updateUser();
          });

          // this.#articlePanel.innerHTML =
          // '<a href="/article/upload">New Article</a>';
        } else {
          this.#userPanel.innerHTML = `
        <li><button id="login-button">Log In</button></li>
        <li><button id="signup-button">Sign Up</button></li>
        `;

          const loginButton = this.#userPanel.querySelector("#login-button");
          loginButton.addEventListener("click", async () => {
            const succeed = await raiseModal("<x-login-panel></x-login-panel>");
            if (succeed) this.updateUser();
          });

          const signupButton = this.#userPanel.querySelector("#signup-button");
          signupButton.addEventListener("click", async () => {
            const succeed = await raiseModal(
              "<x-signup-panel></x-signup-panel>"
            );
            if (succeed) this.updateUser();
          });

          // this.#articlePanel.innerHTML = "";
        }
      }
    }
);
