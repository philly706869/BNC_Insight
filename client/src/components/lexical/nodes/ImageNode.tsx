import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  createCommand,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { ReactNode } from "react";

type SerializedImageNode = SerializedLexicalNode & {
  type: "image";
  src: string;
  alt: string;
  caption: string;
};

export class ImageNode extends DecoratorNode<ReactNode> {
  public __src: string;
  public __alt: string;
  public __caption: string;

  setCaption(value: string) {
    const self = this.getWritable();
    self.__caption = value;
  }

  constructor(src: string, alt: string, caption: string = "", key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__caption, node.__key);
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const figure = document.createElement("figure");
    return figure;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(_serializedNode: SerializedImageNode): LexicalNode {
    const { src, alt, caption } = _serializedNode;
    return new ImageNode(src, alt, caption);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
    };
  }

  decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
    return (
      <>
        <img src={this.__src} alt={this.__alt} />
        <caption>Test Caption</caption>
      </>
    );
  }
}

export function $createImageNode(src: string, alt: string): ImageNode {
  return new ImageNode(src, alt);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

export const INSERT_IMAGE_COMMAND = createCommand<{
  src: string;
  alt: string;
}>();

export function registerImage(editor: LexicalEditor) {
  return editor.registerCommand(
    INSERT_IMAGE_COMMAND,
    ({ src, alt }) => {
      editor.update(() => {
        const imageNode = $createImageNode(src, alt);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        } else {
          const root = $getRoot();
          root.append(imageNode);
        }
      });
      return true;
    },
    0
  );
}
