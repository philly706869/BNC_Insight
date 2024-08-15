"use client";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const Quill = dynamic(() => import("react-quill"), {
  loading: () => <div>Loding Editor...</div>,
  ssr: false,
});

export default Quill;
