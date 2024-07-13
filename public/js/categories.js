export const { categories } = await fetch(`/api/categories`).then((data) =>
  data.json()
);
