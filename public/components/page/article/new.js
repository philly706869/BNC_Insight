import { createComponent } from "../../../js/component.js";
import { createJQuerySelector } from "../../../js/shadowJQuery.js";
import {} from "../../app.js";
import {} from "../../article/editor.js";

createComponent(
  import.meta.url,
  (Component) =>
    class NewArticle extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);

        $$("#editor").on("submit", async (event, article) => {
          const res = await fetch("/api/article", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(article),
          });

          if (res.ok) {
            const { uid } = await res.json();
            window.location.href = `/article/${uid}`;
          }
        });
      }
    }
);
