import $ from "jquery";
import { createComponent } from "../../js/component.js";
import { createJQuerySelector } from "../../js/shadowJQuery.js";

createComponent(
  import.meta.url,
  (Component) =>
    class AccountControlPanel extends Component {
      #$title;

      constructor(protectedProps) {
        super(protectedProps);
        const $$ = createJQuerySelector(protectedProps.shadowRoot);
        const $this = $(this);

        const $closeButton = $$("#close-button");
        $closeButton.on("click", () => {
          const $modal = $this.offsetParent();
          $modal.fadeOut(200, () => $modal.triggerHandler("close", [false]));
        });

        const $slides = $this.children();
        $slides.first().attr("display", "");

        let index = 0;

        $this.on("nextSlide", () => {
          if (index >= $slides.length - 1) return;
          const $oldSlide = $slides.eq(index);
          index += 1;
          const $newSlide = $slides.eq(index);
          $oldSlide.triggerHandler("disappear");
          $newSlide.triggerHandler("appear");
        });

        $this.on("focusSlide", (event) => {
          if (event.target !== this) return;
          $slides.eq(index).triggerHandler("focusInput");
        });

        this.#$title = $$("#title");
      }

      static observedAttributes = ["title"];

      onAttributeUpdate(name, oldValue, newValue) {
        const $title = this.#$title;

        switch (name) {
          case "title":
            $title.text(newValue);
            break;
        }
      }
    }
);
