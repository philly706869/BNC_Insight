import { createComponent } from "../../js/component.js";
import {} from "../app.js";

createComponent(
  (Component) =>
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
);
