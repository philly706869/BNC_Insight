import { createComponent } from "../../js/component.js";
import {} from "../input.js";

createComponent(
  import.meta.url,
  (Component, getProtectedProps) => class Editor extends Component {}
);
