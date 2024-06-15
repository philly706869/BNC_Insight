import { marked } from "./external/marked.js";

export const markdownToHTML = (markdown) => {
  const sanitized = markdown.replace(
    /[<&"']/g,
    (char) => `&#${char.charCodeAt(0)};`
  );

  return marked.parse(sanitized);
};
