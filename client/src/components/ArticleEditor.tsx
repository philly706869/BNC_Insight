import "cropperjs/dist/cropper.css";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  ChangeEvent,
  ComponentProps,
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { ReactCropperElement } from "react-cropper";
import { postImage } from "../services/image-service";
import { TextFieldChangeEvent } from "../types/mui";
import { GeneralTextField } from "./GeneralTextField";
import { RichTextEditor } from "./RichTextEditor";

type Thumbnail = {
  url: string;
  caption: string;
};

type ThumbnailInputProps = {
  url?: string | null;
  caption?: string;
  captionHelperText?: ReactNode;
  captionError?: boolean;
  onUrlChange?: (value: string | null) => void;
  onCaptionChange?: (value: string) => void;
};

const ThumbnailInput: FC<ThumbnailInputProps> = (props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailCaption, setThumbnailCaption] = useState<string>("");
  const [selected, setSelected] = useState();

  const handleThumbnailCaptionChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setThumbnailCaption(target.value);
    },
    []
  );

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailUrl(null);
  }, []);

  return (
    <>
      {thumbnailUrl !== null ? (
        <>
          <img alt="thumbnail" src={thumbnailUrl} />
          <GeneralTextField
            label="Thumbnail Caption"
            value={thumbnailCaption}
            onChange={handleThumbnailCaptionChange}
            helperText={props.captionHelperText}
            error={props.captionError}
          />
          <button onClick={handleThumbnailRemove}>Remove thumbnail</button>
        </>
      ) : (
        <>
          <button>Set Thumbnail</button>
          <input type="file" accept=".jpeg,.jpg,.png,.webp" hidden />
        </>
      )}
    </>
  );
};

const richTextEditorConfig: ComponentProps<
  typeof RichTextEditor
>["initialConfig"] = {
  namespace: "ArticleEditor",
  onError(error) {},
};

type Props = {
  mode: "edit" | "read";
  categories: string[];
  onSubmit?: (data: { category: string }) => void;
  submitButtonLabel?: ReactNode;
};

export const ArticleEditor: FC<Props> = (props) => {
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [subtitleMessage, setSubtitleMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleCategoryChange = useCallback(
    (event: MouseEvent<HTMLElement>, value: any) => {
      if (value !== null) {
        setCategory(value);
      }
    },
    []
  );

  const handleThumbnailUpload = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (target.files === null) {
        return;
      }
      const file = target.files[0];
      target.files = null;
      target.value = "";
      if (!file) {
        return;
      }

      try {
        const url = await postImage(file);
        setThumbnail({ url, caption: "" });
      } catch {
        alert("Failed to upload image");
      }
    },
    []
  );

  const handleThumbnailSet = useCallback(() => {
    fileInputRef.current!.click();
  }, []);

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
        <ThumbnailInput />
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
        <RichTextEditor
          mode={"edit"}
          initialConfig={richTextEditorConfig}
          placeholder={<span>Write article body here</span>}
        />
        <button type="submit">{props.submitButtonLabel ?? "Submit"}</button>
      </form>
    </>
  );
};
