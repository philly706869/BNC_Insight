export const THUMBNAIL_SERVICE_URL = "/cdn/thumbnails";

export async function postThumbnail(
  blob: Blob
): Promise<{ url: string; name: string }> {
  const data = new FormData();
  data.append("image", blob);
  const response = await fetch(THUMBNAIL_SERVICE_URL, {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}
