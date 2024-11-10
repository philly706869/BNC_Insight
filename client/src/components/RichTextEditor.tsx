import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ComponentProps, FC } from "react";

type Props = {
  mode: "edit" | "read";
  initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"];
  placeholder: ComponentProps<typeof RichTextPlugin>["placeholder"];
};

export const RichTextEditor: FC<Props> = (props) => {
  const placeholder = (() => {
    const mode = props.mode;
    switch (mode) {
      case "edit":
        return props.placeholder;
      case "read":
        return undefined;
    }
    mode satisfies never;
  })();

  return (
    <>
      <LexicalComposer initialConfig={props.initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={placeholder}
        ></RichTextPlugin>
      </LexicalComposer>
    </>
  );
};
