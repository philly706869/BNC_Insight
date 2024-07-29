import { Component, registerComponent } from "../../util/component.js";
import {} from "./panel.js";
import {} from "./slide.js";

class SignupPanel extends Component {
  constructor(props) {
    super(props);
    const { $this, $shadow } = props;

    $shadow.html(
      /*html*/
      `
        <link href="/static/css/global.css" rel="stylesheet" />
        <x-account-control-panel id="panel" title="Sign Up">
          <x-slide
            id="auth-token-slide"
            title="Please enter the authentication token provided by the administrator."
            placeholder="Authentication Token"
            button-text="Continue"
          ></x-slide>
          <x-slide
            id="id-slide"
            title="Please enter your ID."
            placeholder="ID"
            button-text="Continue"
          ></x-slide>
          <x-slide
            id="password-slide"
            title="Please enter your password."
            placeholder="Password"
            password-mode
            button-text="Continue"
          ></x-slide>
          <x-slide
            id="password-confirm-slide"
            title="Please confirm your password."
            placeholder="Password Confirm"
            password-mode
            button-text="Continue"
          ></x-slide>
          <x-slide
            id="name-slide"
            title="Please enter a name to be displayed."
            placeholder="Name"
            button-text="Create Account"
          ></x-slide>
        </x-account-control-panel>
      `
    );

    const $panel = $shadow.find(`#panel`);

    const $authTokenSlide = $panel.find(`#auth-token-slide`);
    const $idSlide = $panel.find(`#id-slide`);
    const $passwordSlide = $panel.find(`#password-slide`);
    const $passwordConfirmSlide = $panel.find(`#password-confirm-slide`);
    const $nameSlide = $panel.find(`#name-slide`);

    let token;
    let id;
    let password;
    let name;

    $authTokenSlide.on(`submit`, async () => {
      const value = $authTokenSlide.prop(`value`);

      const validation = await fetch(`/api/account/auth/token`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({ value }),
      }).then((res) => res.json());

      if (!validation.valid) {
        $authTokenSlide.triggerHandler(`error`, [`Invalid token.`]);
        return;
      }

      token = value;
      $panel.triggerHandler(`nextSlide`);
    });

    $idSlide.on(`submit`, async () => {
      const value = $idSlide.prop(`value`);

      const validation = await fetch(`/api/account/auth/id`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({ value }),
      }).then((res) => res.json());

      if (!validation.valid) {
        $idSlide.triggerHandler(`error`, validation.messages);
        return;
      }

      if (validation.exists) {
        $idSlide.triggerHandler(`error`, [`ID already exists.`]);
        return;
      }

      id = value;
      $panel.triggerHandler(`nextSlide`);
    });

    $passwordSlide.on(`submit`, async () => {
      const value = $passwordSlide.prop(`value`);

      const validation = await fetch(`/api/account/auth/password`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({ value }),
      }).then((res) => res.json());

      if (!validation.valid) {
        $passwordSlide.triggerHandler(`error`, validation.messages);
        return;
      }

      password = value;
      $panel.triggerHandler(`nextSlide`);
    });

    $passwordConfirmSlide.on(`submit`, () => {
      const passwordConfirm = $passwordConfirmSlide.prop(`value`);

      if (password !== passwordConfirm) {
        $passwordConfirmSlide.triggerHandler(`error`, [
          `Password does not match.`,
        ]);
        return;
      }

      $panel.triggerHandler(`nextSlide`);
    });

    $nameSlide.on(`submit`, async () => {
      const value = $nameSlide.prop(`value`);

      const validation = await fetch(`/api/account/auth/name`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({ value }),
      }).then((res) => res.json());

      if (!validation.valid) {
        $nameSlide.triggerHandler(`error`, validation.messages);
        return;
      }

      name = value;

      const res = await fetch(`/api/account`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({
          token,
          id,
          password,
          name,
        }),
      });

      if (!res.ok) {
        alert(`Unknown Error. Sign up failed.`);
        return;
      }

      await fetch(`/api/account/login`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({
          id,
          password,
        }),
      });

      const $modal = $this.closest(`x-modal`);
      $modal.fadeOut(200, () => $modal.trigger(`close`, [true]));
    });

    $this.on(`focusPanel`, (event) => {
      if (event.target !== this) return;
      $panel.triggerHandler(`focusSlide`);
    });
  }
}

registerComponent(SignupPanel);
