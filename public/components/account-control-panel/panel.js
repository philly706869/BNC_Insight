import { createComponent } from "../../js/component.js";

createComponent(
  (Component) =>
    class AccountControlPanel extends Component {
      #$title;

      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              :host {
                padding: 100px;
                display: block;
                position: relative;
                background-color: white;
                border-radius: 20px;
                border: 5px solid var(--scarlet);
              }

              #close-button {
                width: 50px;
                height: 50px;
                position: absolute;
                top: 25px;
                right: 25px;
                background-color: transparent;
                border: none;
                border-radius: 50%;
              }

              #close-button:hover {
                background-color: rgba(0, 0, 0, 0.05);
              }

              #close-button:active {
                background-color: rgba(0, 0, 0, 0.1);
              }

              #close-button > img {
                width: 100%;
                height: 100%;
                filter: opacity(70%);
              }

              #close-button:hover > img {
                filter: opacity(90%);
              }

              #title {
                margin: 10px;
                align-self: center;
                font-size: 30px;
                text-align: center;
              }

              #slider {
                width: 300px;
                height: 200px;
                margin: 0;
                padding: 0;
                list-style: none;
                overflow: hidden;
                display: flex;
                flex-wrap: nowrap;
              }
            </style>
            <button id="close-button"><img src="/static/img/x.svg" /></button>
            <h1 id="title" class="font-1"></h1>
            <ul id="slider">
              <slot></slot>
            </ul>
          `
        );

        const $closeButton = $shadow.find(`#close-button`);
        $closeButton.on(`click`, () => {
          const $modal = $this.offsetParent();
          $modal.fadeOut(200, () => $modal.triggerHandler(`close`, [false]));
        });

        const $slides = $this.children();
        $slides.first().attr(`display`, ``);

        let index = 0;

        $this.on(`nextSlide`, () => {
          if (index >= $slides.length - 1) return;
          const $oldSlide = $slides.eq(index);
          index += 1;
          const $newSlide = $slides.eq(index);
          $oldSlide.triggerHandler(`disappear`);
          $newSlide.triggerHandler(`appear`);
        });

        $this.on(`focusSlide`, (event) => {
          if (event.target !== this) return;
          $slides.eq(index).triggerHandler(`focusInput`);
        });

        this.#$title = $shadow.find(`#title`);
      }

      static observedAttributes = [`title`];

      onAttributeUpdate(name, oldValue, newValue) {
        const $title = this.#$title;

        switch (name) {
          case `title`:
            $title.text(newValue);
            break;
        }
      }
    }
);
