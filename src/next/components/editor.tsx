"use client";
import "./editor.css";
import Quill from "./quill";

function imageHandler(this: any) {
  const { tooltip } = this.quill.theme;
  const { save: originalSave, hide: originalHide } = tooltip;
  tooltip.save = function () {
    const range = this.quill.getSelection(true);
    const value = this.textbox.value;
    if (value) {
      this.quill.insertEmbed(range.index, `image`, value, `user`);
    }
  };
  tooltip.hide = function () {
    this.save = originalSave;
    this.hide = originalHide;
    this.hide();
  };
  tooltip.edit(`image`);
  tooltip.textbox.placeholder = `Embed URL`;
}

export default function Editor() {
  return (
    <>
      <Quill
        theme="snow"
        modules={{
          toolbar: {
            container: [
              { font: [] },
              { header: [1, 2, 3, 4, 5, 6, false] },
              { size: [`small`, false, `large`, `huge`, `10pt`] },
              `bold`,
              `italic`,
              `underline`,
              `strike`,
              `blockquote`,
              `code-block`,
              `link`,
              `image`,
              `video`,
              `formula`,
              { list: `ordered` },
              { list: `bullet` },
              { list: `check` },
              { script: `sub` },
              { script: `super` },
              { indent: `-1` },
              { indent: `+1` },
              { color: [] },
              { background: [] },
              { align: [] },
              `clean`,
            ],
            handlers: {
              image: imageHandler,
            },
          },
        }}
      />
    </>
  );
}
