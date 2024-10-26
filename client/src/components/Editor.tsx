import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { CategoryContext } from "../contexts/CategoryContext";
import Quill from "./Quill";

export default function Editor() {
  const categories = useContext(CategoryContext);
  const [category, setCategory] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [titleHelperText, setTitleHelperText] = useState("");
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const [subtitleHelperText, setSubtitleHelperText] = useState("");
  const quillRef = useRef<ReactQuill>(null);

  return (
    <>
      <ToggleButtonGroup
        value={category}
        onChange={(event: React.MouseEvent<HTMLElement>, category: string) => {
          setCategory(category);
        }}
        exclusive
      >
        {categories.isInitialized
          ? categories.data.map(({ name: category }) => (
              <ToggleButton value={category}>{category}</ToggleButton>
            ))
          : null}
      </ToggleButtonGroup>
      <TextField
        label="Title"
        fullWidth
        inputRef={titleInputRef}
        helperText={titleHelperText}
        error={titleHelperText.length > 0}
        autoComplete="off"
        spellCheck="false"
      />
      <TextField
        label="Subtitle"
        fullWidth
        inputRef={subtitleInputRef}
        helperText={subtitleHelperText}
        error={subtitleHelperText.length > 0}
        autoComplete="off"
        spellCheck="false"
      />
      <Quill />
      <button
        onClick={() => {
          const quill = quillRef.current!;
          const editor = quill.getEditor();
          const content = editor.getContents();
          console.log(content);
          console.log(JSON.stringify(content));
          editor.setContents(content);
        }}
      >
        Upload
      </button>
    </>
  );
}
