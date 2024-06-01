export const fetchHTML = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`status not ok GET ${url}`);
  const html = await res.text();
  return html;
};
