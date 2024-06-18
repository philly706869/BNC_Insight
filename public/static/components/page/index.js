import { createComponent } from "../../js/component.js";
import {} from "../app.js";
import {} from "../modal.js";

createComponent(
  import.meta.url,
  (Component, getProtectedProps) => class Index extends Component {}
);
