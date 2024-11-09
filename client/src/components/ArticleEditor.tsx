import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  ChangeEvent,
  ComponentProps,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { postImage } from "../services/image-service";
import { TextFieldChangeEvent } from "../types/mui";
import { GeneralTextField } from "./GeneralTextField";
import { RichTextEditor } from "./RichTextEditor";

type Props<Category extends string> = {
  mode: "edit" | "read";
  categories: Category[];
  onSubmit?: (data: { category: Category }) => void;
  submitButtonLabel?: ReactNode;
};

type Thumbnail = {
  url: string;
  caption: string;
};

export function ArticleEditor<Category extends string>(props: Props<Category>) {
  const [category, setCategory] = useState<Category | "">("");
  const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [thumbnailCaptionMessage, setThumnailCaptionMessage] = useState<
    string | null
  >(null);
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [subtitleMessage, setSubtitleMessage] = useState<string | null>(null);

  const formSubmitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    },
    []
  );

  const categoryChangeHandler = useCallback(
    (event: MouseEvent<HTMLElement>, value: any) => {
      setCategory(value);
    },
    []
  );

  const thumbnailCaptionChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setThumbnail((thumbnail) =>
        thumbnail !== null
          ? { url: thumbnail.url, caption: target.value }
          : null
      );
      setThumnailCaptionMessage(null);
    },
    []
  );

  const removeThumbnailHandler = useCallback(() => {
    setThumbnail(null);
  }, []);

  const uploadThumbnailHandler = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (target.files === null) {
        return null;
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

  const titleChangeHandler = useCallback(({ target }: TextFieldChangeEvent) => {
    setTitle(target.value);
    setTitleMessage(null);
  }, []);

  const subtitleChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setSubtitle(target.value);
      setSubtitleMessage(null);
    },
    []
  );

  const richTextEditorConfig: ComponentProps<
    typeof RichTextEditor
  >["initialConfig"] = {
    namespace: "ArticleEditor",
    onError(error) {},
  };

  return (
    <>
      <form onSubmit={formSubmitHandler}>
        <ToggleButtonGroup
          value={category}
          onChange={categoryChangeHandler}
          exclusive
        >
          <ToggleButton value={""}>Uncategorized</ToggleButton>
          {props.categories.map((category) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {thumbnail !== null ? (
          <>
            <img alt="thumbnail" src={thumbnail.url} />
            <GeneralTextField
              label="Thumbnail Caption"
              value={thumbnail.caption}
              onChange={thumbnailCaptionChangeHandler}
              helperText={thumbnailCaptionMessage}
              error={thumbnailCaptionMessage !== null}
            />
            <button onClick={removeThumbnailHandler}>Remove thumbnail</button>
          </>
        ) : (
          <>
            <input type="file" onChange={uploadThumbnailHandler} />
          </>
        )}
        <GeneralTextField
          label="Title"
          value={title}
          onChange={titleChangeHandler}
          helperText={titleMessage}
          error={titleMessage !== null}
        />
        <GeneralTextField
          label="Subtitle"
          value={subtitle}
          onChange={subtitleChangeHandler}
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
}
