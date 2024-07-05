import $ from "jquery";
import { articleUid } from "../../../js/articleUid.js";
import { createComponent } from "../../../js/component.js";
import { createJQuerySelector } from "../../../js/shadowJQuery.js";
import {} from "../../app.js";

const article = await fetch(
  "/api/article?" + new URLSearchParams({ uid: articleUid })
).then((data) => (data.ok ? data.json() : null));

createComponent(
  import.meta.url,
  (Component) =>
    class ViewArticle extends Component {
      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $article = $$("#article");

        if (article) {
          $$("#title").text(article.title);
          $$("#subtitle").text(article.subtitle);
          $$("#uploader").text(`Uploader: ${article.uploader.name}`);
          $$("#views").text(`Views: ${article.views}`);
          $$("#content").text(article.content);
        } else {
          $article.html(`404 Article not found.`);
        }
      }
    }
);
