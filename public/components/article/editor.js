import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";
import {} from "../input.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Editor extends Component {
      #title;

      constructor(protectedProps) {
        super(protectedProps);
        /**
         * @type {{ shadowRoot: ShadowRoot }}
         */
        const { shadowRoot } = protectedProps;
        const $$ = createJQuerySelector(shadowRoot);

        this.#title = $$("#title");

        const $uploadButton = $$("#upload-button");
        const $categorySelect = $$("#category-select");
        const $titleInput = $$("#title-input");
        const $subtitleInput = $$("#subtitle-input");
        const $editorFrame = $$("#editor-frame");

        $editorFrame.on("load", () => {
          const $body = $editorFrame.contents().find("body");
          const resizeEditor = () => $editorFrame.height($body.height());
          resizeEditor();
          const resizeObserver = new ResizeObserver(resizeEditor);
          resizeObserver.observe($body[0]);
        });

        $uploadButton.on("click", () => {
          const category = $categorySelect.find(":selected").val();
          const title = $titleInput.val();
          const subtitle = $subtitleInput.val();

          if (!category) {
            alert("Please choose an category");
            $categorySelect.focus();
            return;
          }

          switch (true) {
            case !title:
            case title.length < 1:
              alert("Please enter title");
              return;
            case title.length > 64:
              alert(
                `Title cannot be greater than 64 characters (current length: ${title.length})`
              );
              return;
          }

          switch (true) {
            case !subtitle:
            case subtitle.length < 1:
              alert("Please enter subtitle");
              return;
            case subtitle.length > 128:
              alert(
                `Subtitle cannot be greater than 128 characters (current length: ${subtitle.length})`
              );
              return;
          }

          const quill = $editorFrame[0].contentWindow.quill;
          const json = JSON.stringify(quill.getContents().ops);
          console.log(json);
          quill.setContents(JSON.parse(json));

          this.dispatchEvent(
            new CustomEvent("submit", {
              detail: { category, title, subtitle, content: [] },
            })
          );
        });
      }

      static observedAttributes = ["title"];

      onAttributeUpdate(name, oldValue, newValue) {
        switch (name) {
          case "title":
            this.#title.text(newValue);
            break;
        }
      }
    }
);
