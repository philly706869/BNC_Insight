import katex from "katex";
import { RefObject, useEffect, useMemo, useRef } from "react";
import ReactQuill, { Quill as QuillType } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Editor.css";

window.katex = katex;

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

type DeltaStatic = ReturnType<InstanceType<typeof QuillType>["getContents"]>;

type Props = {
  forwaredRef?: RefObject<ReactQuill>;
  viewMode?: boolean;
  delta?: DeltaStatic;
};

export default function Quill({ forwaredRef, viewMode, delta }: Props) {
  const replaceRef = useRef<ReactQuill>(null);
  const quillRef = forwaredRef || replaceRef;

  const modules = useMemo(
    () =>
      viewMode
        ? {
            toolbar: false,
          }
        : {
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
          },
    [viewMode]
  );

  useEffect(() => {
    if (delta) {
      const quill = quillRef.current!;
      const editor = quill.getEditor();
      editor.setContents(delta);
    }
  }, [delta, quillRef]);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      readOnly={viewMode}
      modules={modules}
    />
  );
}
