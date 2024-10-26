export type Category = {
  name: string;
  createdAt: string;
  updatedAt: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    return Promise.reject();
  }
  return (await response.json()) as Category[];
}

export async function postCategory(name: string): Promise<void> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function patchCategory(
  name: string,
  data: { name?: string }
): Promise<void> {
  const response = await fetch(`/api/categories/${name}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function deleteCategory(name: string): Promise<void> {
  const response = await fetch(`/api/categories/${name}`, { method: "DELETE" });
  if (!response.ok) {
    return Promise.reject();
  }
}
