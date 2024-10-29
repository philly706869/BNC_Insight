export async function postImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("image", file);
  const response = await fetch("/api/images", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return (await response.json()).url as string;
}
