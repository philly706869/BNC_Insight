import $ from "jquery";
import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";
import {} from "../input.js";

const { categories } = await fetch("/api/category").then((data) => data.json());

createComponent(
  import.meta.url,
  (Component) =>
    class Editor extends Component {
      #$title;

      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $categorySelect = $$("#category-select");

        for (const category of categories) {
          const $button = $(`<button class="category-button"></button>`);
          $button.attr("data-category", category);
          $button.text(category);
          $categorySelect.append($("<li></li>").append($button));
        }

        const $categoryButton = $categorySelect.find(".category-button");

        $categoryButton.first().attr("data-selected", "");

        $categoryButton.on("click", (event) => {
          const currentSelected = $categorySelect.filter("[data-selected]");
          currentSelected.removeAttr("data-selected");
          $(event.currentTarget).attr("data-selected", "");
        });

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

        $$("#upload-button").on("click", () => {
          const category = $categoryButton
            .filter("[data-selected]")
            .attr("data-category");
          const title = $titleInput.val();
          const subtitle = $subtitleInput.val();

          switch (true) {
            case !category:
              alert("Please choose an category");
              return;
            case !categories.includes(category):
              alert("Unknown error in category");
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
          const content = quill.getContents().ops;

          $this.trigger("submit", [{ category, title, subtitle, content }]);
        });

        this.#$title = $$("#title");
      }

      static observedAttributes = ["title"];

      onAttributeUpdate(name, oldValue, newValue) {
        switch (name) {
          case "title":
            this.#$title.text(newValue);
            break;
        }
      }
    }
);
