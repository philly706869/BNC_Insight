import { Component } from "./component";

export class App extends Component {
  template() {
    return `
    <header>
      <a class="logo font-cg-bold" href="/">BNC_Insight</a>
    </header>
    <main>
      <form>
        <h1 class="font-1">Sign Up</h1>
        <ul class="slider">
          <li class="slide">
            <div class="input-box">
              <div class="input-wrapper">
                <input
                  class="input"
                  id="id-input"
                  type="text"
                  autocomplete="off"
                  title="Please enter your ID."
                  required
                  autofocus
                />
                <label class="placeholder" for="id-input">ID</label>
              </div>
              <label class="error-message" for="id-input" hidden></label>
            </div>
            <button class="continue-button">Continue</button>
          </li>
          <li class="slide">
            <div class="input-box">
              <div class="input-wrapper">
                <input
                  class="input"
                  id="password-input"
                  type="password"
                  title="Please enter your password."
                  required
                />
                <label class="placeholder" for="password-input">Password</label>
              </div>
              <label class="error-message" for="password-input" hidden></label>
            </div>
          </li>
          <li class="slide">
            <div class="input-box">
              <div class="input-wrapper">
                <input
                  class="input"
                  id="password-confirm-input"
                  type="password"
                  title="Please confirm your password."
                  required
                />
                <label class="placeholder" for="password-confirm-input"
                  >Password Confirm</label
                >
              </div>
              <label
                class="error-message"
                for="password-confirm-input"
                hidden
              ></label>
            </div>
          </li>
          <li class="slide">
            <div class="input-box">
              <div class="input-wrapper">
                <input
                  class="input"
                  id="name-input"
                  type="text"
                  autocomplete="off"
                  title="Please enter a name to be displayed."
                  required
                />
                <label class="placeholder" for="name-input">Name</label>
              </div>
              <label class="error-message" for="name-input" hidden></label>
            </div>
          </li>
          <li class="slide">
            <div class="input-box">
              <div class="input-wrapper">
                <input
                  class="input"
                  id="auth-token-input"
                  type="text"
                  autocomplete="off"
                  title="Please enter the authentication token provided by the administrator."
                  required
                />
                <label class="placeholder" for="auth-token-input"
                  >Authentication Token</label
                >
              </div>
              <label
                class="error-message"
                for="auth-token-input"
                hidden
              ></label>
            </div>
          </li>
        </ul>
      </form>
    </main>
    `;
  }
}
