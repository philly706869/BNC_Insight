export const IMAGE_SERVICE_URL = "/cdn/images";

export async function postImage(
  blob: Blob
): Promise<{ url: string; name: string }> {
  const data = new FormData();
  data.append("image", blob);
  const response = await fetch(IMAGE_SERVICE_URL, {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}
