import { Component, registerComponent } from "../../js/component.js";
import {} from "../app.js";

class Adminator extends Component {
  constructor(props) {
    super(props);
    const { $this, $shadow } = props;

    $shadow.html(
      /*html*/
      `
        <link href="/static/css/global.css" rel="stylesheet" />
        <style>
          
        </style>
        <x-app>
          <input id="token-input" type="text">
          <input id="is-admin-input" type="checkbox">
          <button id="create-button">Create</button>
        </x-app>
      `
    );

    const $tokenInput = $shadow.find(`#token-input`);
    const $isAdminInput = $shadow.find(`#is-admin-input`);
    const $createButton = $shadow.find(`#create-button`);
  }
}

registerComponent(Adminator);
