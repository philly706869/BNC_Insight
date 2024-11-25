export async function postImage(
  blob: Blob
): Promise<{ url: string; name: string }> {
  const data = new FormData();
  data.append("image", blob);
  const response = await fetch("/cdn/images", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}
