export const { categories } = await fetch("/api/category").then((data) =>
  data.json()
);
