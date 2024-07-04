import $ from "jquery";
import { createComponent } from "../js/component.js";

createComponent(
  import.meta.url,
  (Component) =>
    class Modal extends Component {
      constructor() {
        super();
        const $this = $(this);

        $this.on("close", () => {
          $this.remove();
        });
      }
    }
);

export function raiseModal() {
  const $template = $("<template></template>");
  $template.html("<x-modal></x-modal>");
  const $modal = $template.contents();
  $("body").append($modal);
  return $modal;
}
