import dynamic from "next/dynamic";
import { QuillOptions } from "react-quill";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Quill(options: QuillOptions) {
  return <ReactQuill {...options} />;
}
