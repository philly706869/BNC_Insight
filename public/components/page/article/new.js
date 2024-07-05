import { createComponent } from "../../../js/component.js";
import {} from "../../app.js";
import {} from "../../article/editor.js";

createComponent(
  (Component) =>
    class NewArticle extends Component {
      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              #body {
                flex: 1 0;
                width: 60%;
              }
            </style>
            <x-app>
              <div id="body">
                <x-editor id="editor" title="New Article"></x-editor>
              </div>
            </x-app>
          `
        );

        $shadow.find("#editor").on("submit", async (event, article) => {
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
