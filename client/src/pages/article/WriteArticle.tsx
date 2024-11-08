import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useSearchParams } from "react-router-dom";
import Quill from "../../components/Quill";
import { CategoryContext } from "../../contexts/CategoryContext";
import { postArticle } from "../../services/article-service";
import { postImage } from "../../services/image-service";

export function WriteArticle() {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const categories = useContext(CategoryContext);

  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<{
    url: string;
    caption: string;
  } | null>(null);
  const [thumbnailCaptionMessage, setThumnailCaptionMessage] = useState<
    string | null
  >(null);
  const [title, setTitle] = useState("");
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState("");
  const [subtitleMessage, setSubtitleMessage] = useState<string | null>(null);

  const quillRef = useRef<ReactQuill>(null);

  return (
    <>
      {categories.isInitialized ? (
        <ToggleButtonGroup
          value={category}
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            category: string
          ) => {
            setCategory(category);
          }}
          exclusive
        >
          <ToggleButton value={""}>Uncategorized</ToggleButton>
          {categories.data.map(({ name: category }) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : (
        <p>Loading categories...</p>
      )}
      {thumbnail !== null ? (
        <>
          <img alt="thumbnail" src={thumbnail.url} />
          <TextField
            label="Thumbnail Caption"
            fullWidth
            value={thumbnail.caption}
            onChange={({ target }) => {
              setThumbnail((thumbnail) =>
                thumbnail !== null
                  ? { url: thumbnail.url, caption: target.value }
                  : null
              );
              setThumnailCaptionMessage(null);
            }}
            helperText={thumbnailCaptionMessage}
            error={thumbnailCaptionMessage !== null}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={() => {
              setThumbnail(null);
            }}
          >
            Remove thumbnail
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            onChange={async ({ target }) => {
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
            }}
          />
        </>
      )}
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={({ target }) => {
          setTitle(target.value);
          setTitleMessage(null);
        }}
        helperText={titleMessage}
        error={titleMessage !== null}
        autoComplete="off"
        spellCheck="false"
      />
      <TextField
        label="Subtitle"
        fullWidth
        value={subtitle}
        onChange={({ target }) => {
          setSubtitle(target.value);
          setSubtitleMessage(null);
        }}
        helperText={subtitleMessage}
        error={subtitleMessage !== null}
        autoComplete="off"
        spellCheck="false"
      />
      <Quill forwaredRef={quillRef} />
      <button
        onClick={async () => {
          const quill = quillRef.current!;
          const editor = quill.getEditor();
          const content = editor.getContents();
          try {
            const aritcle = await postArticle(
              category === "" ? null : category,
              thumbnail,
              title,
              subtitle,
              JSON.stringify(content)
            );
            navigate(`/article/${aritcle.uid}`);
            navigate(0);
          } catch (error: any) {
            console.log(error);
            if (error.details) {
              for (const issue of error.details as {
                path: string[];
                message: string;
              }[]) {
                if (issue.path.includes("caption")) {
                  setThumnailCaptionMessage(issue.message);
                } else if (issue.path.includes("title")) {
                  setTitleMessage(issue.message);
                } else if (issue.path.includes("subtitle")) {
                  setSubtitleMessage(issue.message);
                } else if (issue.path.includes("content")) {
                  alert(issue.message);
                } else {
                  alert("Unknown error occured while uploading article");
                  break;
                }
              }
            } else {
              alert("Unknown error occured while uploading article");
            }
          }
        }}
      >
        Upload
      </button>
    </>
  );
}
