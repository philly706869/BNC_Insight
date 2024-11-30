export const CATEGORY_SERVICE_URL = "/api/categories";

export type Category = {
  name: string;
  createdAt: string;
  updatedAt: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(CATEGORY_SERVICE_URL);
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}

export async function postCategory(name: string): Promise<void> {
  const response = await fetch(CATEGORY_SERVICE_URL, {
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
  const response = await fetch(`${CATEGORY_SERVICE_URL}/${name}`, {
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
  const response = await fetch(`${CATEGORY_SERVICE_URL}/${name}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    return Promise.reject();
  }
}
