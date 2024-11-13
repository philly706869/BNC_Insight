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
import ReactCropper, { ReactCropperElement } from "react-cropper";
import { postImage } from "../services/image-service";
import { TextFieldChangeEvent } from "../types/mui";
import { blobToDataUrl } from "../utils/blob-to-data-url";
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
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  );
  const [cropper, setCropper] = useState<Cropper>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailCaptionChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setThumbnailCaption(target.value);
    },
    []
  );

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailUrl(null);
  }, []);

  const handleFileChange = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      const files = target.files;
      if (files === null) {
        return;
      }

      const file = files[0];
      target.files = null;
      target.value = "";
      if (!file) {
        return;
      }

      const dataUrl = await blobToDataUrl(file);
      setSelectedThumbnail(dataUrl);
    },
    []
  );

  const handleThumbnailSet = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCropInitialize = useCallback((instance: Cropper) => {
    setCropper(instance);
  }, []);

  const handleCrop = useCallback(async () => {
    if (cropper === undefined) {
      return;
    }
    const canvas = cropper.getCroppedCanvas({ width: 1280, height: 720 });
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob === null) {
            return reject();
          }
          return resolve(blob);
        },
        "image/webp",
        1
      );
    });

    setThumbnailUrl(URL.createObjectURL(blob));
    setSelectedThumbnail(null);
  }, [cropper]);

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
          <button onClick={handleThumbnailSet}>Set Thumbnail</button>
          {selectedThumbnail !== null && (
            <>
              <ReactCropper
                onInitialized={handleCropInitialize}
                src={selectedThumbnail}
                viewMode={1}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
                aspectRatio={16 / 9}
                initialAspectRatio={16 / 9}
              />
              <button onClick={handleCrop}>Crop</button>
            </>
          )}
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
