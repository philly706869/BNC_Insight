import { createComponent } from "../../../js/component.js";
import {} from "../../app.js";
import {} from "../../article/editor.js";

createComponent(
  (Component) =>
    class EditArticle extends Component {
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
                <x-editor id="editor" title="Edit Article"></x-editor>
              </div>
            </x-app>
          `
        );

        $shadow.find("#editor").on("submit", (event) => {});
      }
    }
);
