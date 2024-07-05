import { createComponent } from "../../../js/component.js";
import { createJQuerySelector } from "../../../js/shadowJQuery.js";
import {} from "../../app.js";
import {} from "../../article/editor.js";

createComponent(
  import.meta.url,
  (Component) =>
    class EditArticle extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);

        $$("#editor").on("submit", (event) => {});
      }
    }
);
