import $ from "jquery";
import { categories } from "../../js/categories.js";
import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";
import {} from "../app.js";
import {} from "../modal.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Index extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);

        const $category = $$("#category");

        for (const category of categories) {
          const $categoryItem = $("<li></li>").append(
            $(`<a href="/"></a>`).text(category)
          );
          $category.append($categoryItem);
        }
      }
    }
);
