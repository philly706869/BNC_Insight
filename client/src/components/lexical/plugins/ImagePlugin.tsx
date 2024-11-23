import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FC, useEffect } from "react";
import { registerImage } from "../nodes/ImageNode";

export const ImagePlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerImage(editor);
  }, [editor]);
  return null;
};
