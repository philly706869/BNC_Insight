import $ from "jquery";
import { createComponent } from "../js/component.js";
import {} from "./account-control-panel/login.js";
import {} from "./account-control-panel/signup.js";
import { raiseModal } from "./modal.js";

const getUser = async () => {
  const res = await fetch("/api/account");
  return res.ok ? (await res.json()).user : null;
};

createComponent(
  (Component) =>
    class Header extends Component {
      #$userPanel;
      #$articlePanel;

      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              :host {
                padding: 30px;
                display: flex;
                flex-direction: column;
              }
            
              header {
                display: flex;
              }
            
              header > div {
                flex: 1 0;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            
              #time-panel {
                font-size: large;
              }
            
              #logo {
                color: var(--regular-scarlet);
                font-size: 50px;
                text-decoration: none;
              }
            
              #user-panel {
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                list-style: none;
              }
            
              #user-panel > li {
                flex: 1 0;
                height: 100%;
                display: flex;
                align-items: center;
              }
            
              #user-panel > li > button,
              #user-panel > li > a {
                width: max-content;
                height: 100%;
                padding: 0 15px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
                background-color: transparent;
                font-size: large;
              }
            
              #user-panel > li > button:hover,
              #user-panel > li > a:hover {
                background-color: rgba(0, 0, 0, 0.05);
              }
            
              #user-panel > li > button:active,
              #user-panel > li > a:active {
                background-color: rgba(0, 0, 0, 0.1);
              }
            
              #article-panel {
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: row-reverse;
              }
            </style>
            <header>
              <div>
                <time id="time-panel"></time>
              </div>
              <div>
                <a id="logo" class="font-cg-bold" href="/">BNC_Insight</a>
              </div>
              <div>
                <ul id="user-panel"></ul>
              </div>
            </header>
            <nav id="article-panel"></nav>
          `
        );

        const $timePanel = $shadow.find("#time-panel");
        const date = new Date();
        $timePanel.text(date.toDateString());
        $timePanel.attr("datetime", date.toISOString().split("T")[0]);

        this.#$userPanel = $shadow.find("#user-panel");
        this.#$articlePanel = $shadow.find("#article-panel");

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
            await fetch("/api/account/logout", { method: "POST" });
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
