export * from "https://cdnjs.cloudflare.com/ajax/libs/marked/13.0.0/lib/marked.esm.js";
import { marked } from "./marked.js";

marked.use({
  gfm: true,
});
