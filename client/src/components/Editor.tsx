import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import Quill from "./Quill";

type Props = {
  categories: string[];
};

export default function Editor({ categories }: Props) {
  const [category, setCategory] = useState<string | undefined>(categories[0]);
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
        {categories.map((category) => (
          <ToggleButton value={category}>{category}</ToggleButton>
        ))}
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
