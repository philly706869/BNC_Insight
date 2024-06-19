import { createComponent } from "../../js/component.js";
import {} from "../app.js";

createComponent(
  import.meta.url,
  (Component) => class User extends Component {}
);
