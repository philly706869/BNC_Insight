import {} from "../components/app.js";
import { Component, registerComponent } from "../util/component.js";

class User extends Component {
  constructor(props) {
    super(props);
    const { $this, $shadow } = props;

    $shadow.html(
      /*html*/
      `
      <link href="/static/css/global.css" rel="stylesheet" />
      <style></style>
      <x-app></x-app>
    `
    );
  }
}

registerComponent(User);
