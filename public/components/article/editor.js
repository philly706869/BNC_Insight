import { createComponent } from "../../js/component.js";
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

        const editor = shadowRoot.querySelector("#editor");

        const combineSameTags = (nodes) => {
          if (nodes.length < 2) return;
          let currentNode = nodes[0];

          for (let i = 1; i < nodes.length; i++) {
            const node = nodes[i];
            console.log(node);
            if (node.tagName === currentNode.tagName) {
              if (currentNode.nodeType === Node.TEXT_NODE) {
                currentNode.data += node.data;
              } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                currentNode.append(...node.childNodes);
              }
              node.remove();
            } else {
              combineSameTags(currentNode.childNodes);
              currentNode = node;
            }
          }
          combineSameTags(currentNode.childNodes);
        };

        editor.addEventListener("keydown", (event) => {
          /**
           * @type {Selection}
           */
          const selection = shadowRoot.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
              const bold = document.createElement("b");
              const text = range.extractContents();
              text.querySelectorAll("b").forEach((element) => {
                element.replaceWith(...element.childNodes);
              });
              bold.appendChild(text);
              range.insertNode(bold);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            combineSameTags(editor.childNodes);
          }

          switch (event.key) {
            case "Enter":
              break;
          }
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
