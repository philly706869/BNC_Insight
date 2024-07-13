import $ from "jquery";
import { categories, getCategories } from "../../js/categories.js";
import { createComponent } from "../../js/component.js";
import {} from "../input.js";

createComponent(
  (Component) =>
    class Editor extends Component {
      #$title;

      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              #article-field {
                padding: 30px;
                border-width: 3px 2px;
                border-style: solid;
                border-color: var(--scarlet) var(--light-silver);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
              }
            
              #category-select {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: space-between;
                list-style: none;
              }
            
              #category-select > li {
                flex: 1;
              }
            
              .category-button {
                padding: 0;
                width: 100%;
                height: 100%;
                border: none;
                background-color: transparent;
                font-size: medium;
              }
            
              .category-button[selected] {
                background-color: var(--scarlet);
                color: white;
              }
            
              x-input {
                width: 100%;
              }
            
              #editor-frame {
                border: none;
                width: 100%;
              }
            
              #upload-button {
                width: 200px;
                height: 50px;
                border: none;
                border-radius: 3px;
                background-color: var(--regular-scarlet);
                color: white;
                font-size: large;
              }
            
              #upload-button:hover {
                background-color: var(--deep-scarlet);
              }
            </style>
            <h1 id="title"></h1>
            <div id="article-field">
              <ul id="category-select"></ul>
              <x-input id="title-input" placeholder="Title" maxlength="64"></x-input>
              <x-input id="subtitle-input" placeholder="Subtitle" maxlength="128"></x-input>
              <iframe
                id="editor-frame"
                src="/static/components/article/editor-frame.html"
              ></iframe>
              <button id="upload-button">Upload</button>
            </div>
          `
        );

        const $categorySelect = $shadow.find(`#category-select`);

        function appendCategory(category) {
          const $button = $(`<button class="category-button"></button>`);
          $button.attr(`data-category`, category);
          $button.text(category);
          $categorySelect.append($(`<li></li>`).append($button));
        }

        const $appendButton = $(`<button>+</button>`);
        $appendButton.on(`click`, async () => {
          // const $modal =  raiseModal().hide()
          // const $
          // $modal.append()
          // $modal.fadeIn(200);
          // $modal.on(`close`, (_, succeed) => {

          // });
          const categoryName = prompt(
            `Enter the category name you want to add`
          );

          const errors = [];

          if (categoryName.trim() !== categoryName)
            errors.push(`Category cannot start or end with a space.`);

          if (categoryName.includes(`\n`))
            errors.push(`Category cannot contain line breaks.`);

          switch (true) {
            case categoryName.length < 1:
              errors.push(`Category cannot be empty`);
              break;
            case categoryName.length > 16:
              errors.push(`Category cannot be greater than 16 characters.`);
              break;
          }

          if (errors.length !== 0) {
            alert(`Failed to add category.\n${errors.join(`\n`)}`);
            return;
          }

          const res = await fetch(`/api/categories`, {
            method: `POST`,
            headers: {
              "Content-Type": `application/json`,
            },
            body: JSON.stringify({ value: categoryName }),
          });
          if (!res.ok) {
            alert(`Failed to add category.\nCategory name duplicated.`);
          }
          categories.push(categoryName);
          categories.sort();
        });

        for (const category of categories) appendCategory(category);
        $categorySelect.append($(`<li></li>`).append($appendButton));

        const $categoryButton = $categorySelect.find(`.category-button`);

        $categoryButton.first().attr(`selected`, ``);

        $categoryButton.on(`click`, (event) => {
          const currentSelected = $categoryButton.filter(`[selected]`);
          currentSelected.removeAttr(`selected`);
          $(event.currentTarget).attr(`selected`, ``);
        });

        const $titleInput = $shadow.find(`#title-input`);
        const $subtitleInput = $shadow.find(`#subtitle-input`);
        const $editorFrame = $shadow.find(`#editor-frame`);

        $editorFrame.on(`load`, () => {
          const $body = $editorFrame.contents().find(`body`);
          const resizeEditor = () => $editorFrame.height($body.height());
          resizeEditor();
          const resizeObserver = new ResizeObserver(resizeEditor);
          resizeObserver.observe($body[0]);
        });

        $shadow.find(`#upload-button`).on(`click`, () => {
          const category = $categoryButton
            .filter(`[selected]`)
            .attr(`data-category`);
          const title = $titleInput.val();
          const subtitle = $subtitleInput.val();

          switch (true) {
            case !category:
              alert(`Please choose an category`);
              return;
            case !getCategories.includes(category):
              alert(`Unknown error in category`);
              return;
          }

          switch (true) {
            case !title:
            case title.length < 1:
              alert(`Please enter title`);
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
              alert(`Please enter subtitle`);
              return;
            case subtitle.length > 128:
              alert(
                `Subtitle cannot be greater than 128 characters (current length: ${subtitle.length})`
              );
              return;
          }

          const quill = $editorFrame[0].contentWindow.quill;
          const content = quill.getContents().ops;

          $this.trigger(`submit`, [{ category, title, subtitle, content }]);
        });

        this.#$title = $shadow.find(`#title`);
      }

      static observedAttributes = [`title`];

      onAttributeUpdate(name, oldValue, newValue) {
        switch (name) {
          case `title`:
            this.#$title.text(newValue);
            break;
        }
      }
    }
);
