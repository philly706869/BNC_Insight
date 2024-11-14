import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
} from "lexical";
import { FC, useCallback, useEffect, useState } from "react";

const supportedBlockType = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  quote: "Block Quote",
  numberedList: "Numbered List",
  bulletedList: "Bulleted List",
  checkList: "Check List",
} as const;

type BlockType = keyof typeof supportedBlockType;

export const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const handleBlockTypeChange = useCallback(
    (event: SelectChangeEvent<BlockType>) => {
      const value = event.target.value as BlockType;
      setBlockType(value);
      if (value !== blockType) {
        const updateBlocksType = (createElement: () => ElementNode): void => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            $setBlocksType(selection, createElement);
          });
        };

        switch (value) {
          case "paragraph":
            updateBlocksType(() => $createParagraphNode());
            return;
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            updateBlocksType(() => $createHeadingNode(value));
            return;
          case "quote":
            updateBlocksType(() => $createQuoteNode());
            return;
          case "numberedList":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            return;
          case "bulletedList":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            return;
          case "checkList":
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
            return;
        }
        value satisfies never;
      }
    },
    [blockType, editor]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag();
          setBlockType(tag);
        } else {
          const nodeType = targetNode.getType();
          if (nodeType in supportedBlockType) {
            setBlockType(nodeType as BlockType);
          } else {
            setBlockType("paragraph");
          }
        }
      });
    });
  }, [editor]);

  return (
    <div>
      <Select value={blockType} onChange={handleBlockTypeChange}>
        {(Object.keys(supportedBlockType) as BlockType[]).map((type) => (
          <MenuItem key={type} value={type}>
            {supportedBlockType[type]}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
