import { createComponent } from "../../../js/component.js";
import {} from "../../app.js";
import {} from "../../article/editor.js";

createComponent(
  import.meta.url,
  (Component) =>
    class EditArticle extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const { shadowRoot } = protectedProps;

        const editor = shadowRoot.querySelector("#editor");
        editor.addEventListener("submit", (event) => {});

        const uid = parseInt(
          location.pathname.slice(
            location.pathname.lastIndexOf("/") + 1,
            location.pathname.length
          )
        );
      }
    }
);
