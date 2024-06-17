import { Component, fetchHTML } from "../../js/component.js";
import {} from "../components/app.js";
import {} from "../components/input.js";

const html = await fetchHTML(import.meta.url);

customElements.define(
  "x-article-upload",
  class extends Component {
    constructor() {
      super();
      const { shadowRoot, internals } = this.init(html);

      const categorySelect = shadowRoot.querySelector("#category-select");
      const titleInput = shadowRoot.querySelector("#title-input");
      const subtitleInput = shadowRoot.querySelector("#subtitle-input");
      const uploadButton = shadowRoot.querySelector("#upload-button");

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

        if (markdownArea.value.length > 65535) {
          alert("Aritcle content cannot be greater than 65535 characters");
        }

        if (previewArea.textContent.trim().length < 1) {
          alert("Article content cannot be empty");
          return;
        }
      });
    }
  }
);
