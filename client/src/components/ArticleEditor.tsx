import "cropperjs/dist/cropper.css";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Quill from "quill";
import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { postArticle } from "../services/article-service";
import { TextFieldChangeEvent } from "../types/mui";
import { GeneralTextField } from "./GeneralTextField";
import { QuillEditor } from "./QuillEditor";
import { Thumbnail, ThumbnailInput } from "./ThumbnailInput";

function quillImageHandler(this: any) {
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

const quillModules = {
  toolbar: {
    container: [
      { font: [] },
      { header: [false, 1, 2, 3, 4, 5, 6] },
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
      image: quillImageHandler,
    },
  },
};

type Props = {
  mode: "edit" | "read";
  categories: string[];
  onSubmit?: (data: { category: string }) => void;
  submitButtonLabel?: ReactNode;
};

export const ArticleEditor: FC<Props> = (props) => {
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [thumbnailCaptionMessage, setThumbnailCaptionMessage] = useState<
    string | null
  >(null);
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [subtitleMessage, setSubtitleMessage] = useState<string | null>(null);

  const thumbnailRef = useRef<Thumbnail>(null);
  const quillRef = useRef<Quill>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const thumbnail = thumbnailRef.current;
      const quill = quillRef.current!;
      const content = JSON.stringify(quill.getContents());
      const payload = {
        category,
        title,
        subtitle,
        thumbnail,
        content,
      };
      const { uid } = await postArticle(payload);
    },
    [category, subtitle, title]
  );

  const handleCategoryChange = useCallback(
    (event: MouseEvent<HTMLElement>, value: any) => {
      if (value !== null) {
        setCategory(value);
      }
    },
    []
  );

  const handleTitleChange = useCallback(({ target }: TextFieldChangeEvent) => {
    setTitle(target.value);
    setTitleMessage(null);
  }, []);

  const handleSubtitleChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setSubtitle(target.value);
      setSubtitleMessage(null);
    },
    []
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ToggleButtonGroup
          value={category}
          onChange={handleCategoryChange}
          exclusive
        >
          <ToggleButton value={""}>Uncategorized</ToggleButton>
          {props.categories.map((category) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <ThumbnailInput
          ref={thumbnailRef}
          captionMessage={thumbnailCaptionMessage}
          captionError={thumbnailCaptionMessage !== null}
        />
        <GeneralTextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
          helperText={titleMessage}
          error={titleMessage !== null}
        />
        <GeneralTextField
          label="Subtitle"
          value={subtitle}
          onChange={handleSubtitleChange}
          helperText={subtitleMessage}
          error={subtitleMessage !== null}
        />
        <QuillEditor
          ref={quillRef}
          theme="snow"
          mode="write"
          placeholder="Write article body here"
          modules={quillModules}
        />
        <button type="submit">{props.submitButtonLabel ?? "Submit"}</button>
      </form>
    </>
  );
};
