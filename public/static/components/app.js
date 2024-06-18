import { createComponent } from "../js/component.js";
import {} from "./header.js";

createComponent(
  import.meta.url,
  (Component, getProtectedProps) => class App extends Component {}
);
