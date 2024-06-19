import { createComponent } from "../../js/component.js";
import {} from "../input.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Editor extends Component {
      #title;

      constructor(protectedProps) {
        super(protectedProps);
        const { shadowRoot } = protectedProps;

        this.#title = shadowRoot.querySelector("#title");

        const uploadButton = shadowRoot.querySelector("#upload-button");
        const categorySelect = shadowRoot.querySelector("#category-select");
        const titleInput = shadowRoot.querySelector("#title-input");
        const subtitleInput = shadowRoot.querySelector("#subtitle-input");

        uploadButton.addEventListener("click", () => {
          const category =
            categorySelect.options[categorySelect.selectedIndex].value;
          const title = titleInput.value;
          const subtitle = subtitleInput.value;

          if (!category) {
            alert("Please choose an category");
            categorySelect.focus();
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

          // if (markdownArea.value.length > 65535) {
          //   alert("Aritcle content cannot be greater than 65535 characters");
          // }

          // if (previewArea.textContent.trim().length < 1) {
          //   alert("Article content cannot be empty");
          //   return;
          // }

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
            this.#title.textContent = newValue;
            break;
        }
      }
    }
);
