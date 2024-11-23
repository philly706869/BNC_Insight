export async function postThumbnail(blob: Blob): Promise<string> {
  const data = new FormData();
  data.append("image", blob);
  const response = await fetch("/cdn/thumbnails", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return (await response.json()).url;
}
