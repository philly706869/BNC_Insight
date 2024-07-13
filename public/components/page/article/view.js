import { articleUid } from "../../../js/articleUid.js";
import { createComponent } from "../../../js/component.js";
import {} from "../../app.js";

const article = await fetch(
  `/api/article?${new URLSearchParams({ uid: articleUid })}`
).then((data) => (data.ok ? data.json() : null));

createComponent(
  (Component) =>
    class ViewArticle extends Component {
      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              #article {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
            </style>
            <x-app>
              <article id="article">
                <header>
                  <h1 id="title"></h1>
                  <h3 id="subtitle"></h3>
                  <div>
                    <span id="uploader"></span>
                    <span id="views"></span>
                  </div>
                </header>
                <main>
                  <iframe id="content"></iframe>
                </main>
              </article>
            </x-app>
          `
        );

        const $article = $shadow.find(`#article`);

        if (article) {
          $article.find(`#title`).text(article.title);
          $article.find(`#subtitle`).text(article.subtitle);
          $article.find(`#uploader`).text(`Uploader: ${article.uploader.name}`);
          $article.find(`#views`).text(`Views: ${article.views}`);
          $article.find(`#content`).text(article.content);
        } else {
          $article.html(`404 Article not found.`);
        }
      }
    }
);
