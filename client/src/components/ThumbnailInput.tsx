import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactCropper from "react-cropper";
import { postThumbnail } from "../services/thumbnail-service";
import { TextFieldChangeEvent } from "../types/mui";
import { blobToDataUrl } from "../utils/blob-to-data-url";
import { GeneralTextField } from "./GeneralTextField";

export type Thumbnail = {
  url: string;
  name: string;
  caption: string;
};

type Props = {
  captionMessage?: string | null;
  captionError?: boolean;
};

export const ThumbnailInput = forwardRef<Thumbnail | null, Props>(
  (props, ref) => {
    const { captionMessage, captionError = false } = props;
    const [url, setUrl] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>("");
    const [selected, setSelected] = useState<string | null>(null);
    const [cropper, setCropper] = useState<Cropper>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle<Thumbnail | null, Thumbnail | null>(
      ref,
      () => {
        return url !== null && name !== null
          ? {
              url: url,
              name: name,
              caption: caption,
            }
          : null;
      },
      [url, name, caption]
    );

    const handleThumbnailCaptionChange = useCallback(
      ({ target }: TextFieldChangeEvent) => {
        setCaption(target.value);
      },
      []
    );

    const handleThumbnailRemove = useCallback(() => {
      setUrl(null);
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
        setSelected(dataUrl);
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

      const { url, name } = await postThumbnail(blob);
      setUrl(url);
      setName(name);
      setSelected(null);
    }, [cropper]);

    return (
      <>
        {url !== null ? (
          <>
            <img alt="thumbnail" src={url} />
            <GeneralTextField
              label="Thumbnail Caption"
              value={caption}
              onChange={handleThumbnailCaptionChange}
              helperText={captionMessage}
              error={captionError}
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
            {selected !== null && (
              <>
                <ReactCropper
                  onInitialized={handleCropInitialize}
                  src={selected}
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
  }
);
