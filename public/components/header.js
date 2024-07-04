import $ from "jquery";
import { createComponent } from "../js/component.js";
import { createJQuerySelector } from "../js/shadowJQuery.js";
import {} from "./account-control-panel/login.js";
import {} from "./account-control-panel/signup.js";
import { raiseModal } from "./modal.js";

const getUser = async () => {
  const res = await fetch("/api/user");
  return res.ok ? await res.json() : null;
};

createComponent(
  import.meta.url,
  (Component) =>
    class Header extends Component {
      #$userPanel;
      #$articlePanel;

      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);

        const $timePanel = $$("#time-panel");
        const date = new Date();
        $timePanel.text(date.toDateString());
        $timePanel.attr("datetime", date.toISOString().split("T")[0]);

        this.#$userPanel = $$("#user-panel");
        this.#$articlePanel = $$("#article-panel");

        this.updateUser();
      }

      async updateUser() {
        const user = await getUser();

        if (user) {
          this.#$userPanel.html(`
            <li><a id="user-button" href="/user"></a></li>
            <li><button id="logout-button">Log Out</button></li>
          `);

          const $userButton = this.#$userPanel.find("#user-button");
          $userButton.text(user.name);
          $userButton.on("click", () => {
            window.location.href = "/user";
          });

          const $logoutButton = this.#$userPanel.find("#logout-button");
          $logoutButton.on("click", async () => {
            await fetch("/user/log", { method: "DELETE" });
            this.updateUser();
          });

          this.#$articlePanel.html('<a href="/article/new">New Article</a>');
        } else {
          this.#$userPanel.html(`
            <li><button id="login-button">Log In</button></li>
            <li><button id="signup-button">Sign Up</button></li>
          `);

          const $loginButton = this.#$userPanel.find("#login-button");
          $loginButton.on("click", async () => {
            const $modal = raiseModal().hide();
            const $panel = $("<x-login-panel></x-login-panel>");
            $modal.append($panel);
            $modal.fadeIn(200, () => $panel.triggerHandler("focusPanel"));
            $modal.on("close", (_, succeed) => {
              if (succeed) this.updateUser();
            });
          });

          const $signupButton = this.#$userPanel.find("#signup-button");
          $signupButton.on("click", async () => {
            const $modal = raiseModal();
            const $panel = $("<x-signup-panel></x-signup-panel>");
            $modal.append($panel);
            $modal.fadeIn(200, () => $panel.triggerHandler("focusPanel"));
            $modal.on("close", (_, succeed) => {
              if (succeed) this.updateUser();
            });
          });

          this.#$articlePanel.html("");
        }
      }
    }
);
