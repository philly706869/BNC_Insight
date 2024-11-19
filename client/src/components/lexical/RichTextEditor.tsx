import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorThemeClasses, Klass, LexicalNode, ParagraphNode } from "lexical";
import { ComponentProps, FC, useMemo } from "react";
import { ToolbarPlugin } from "./ToolbarPlugin";

const nodes: Klass<LexicalNode>[] = [
  ParagraphNode,
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
];

const theme: EditorThemeClasses = {
  heading: {},
};

type Props = {
  mode: "edit" | "read";
  namespace: string;
  placeholder: ComponentProps<typeof RichTextPlugin>["placeholder"];
  onChange?: ComponentProps<typeof OnChangePlugin>["onChange"];
};

export const RichTextEditor: FC<Props> = (props) => {
  const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] =
    useMemo(() => {
      return {
        namespace: props.namespace,
        nodes: nodes,
        theme: theme,
        onError(error, editor) {},
      };
    }, [props.namespace]);

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
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={placeholder}
        />
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        {props.onChange && (
          <OnChangePlugin
            onChange={props.onChange}
            ignoreSelectionChange={true}
          />
        )}
      </LexicalComposer>
    </>
  );
};
