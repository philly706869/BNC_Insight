export type Article = {
  uid: number;
  upload: {
    username: string;
    name: string;
  } | null;
  category: string | null;
  thumbnail: {
    url: string;
    caption: string;
  };
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
};

export type ContentLessArticle = Omit<Article, "content">;

export async function getArticle(uid: number): Promise<Article> {
  const response = await fetch(`/api/articles/${uid}`);
  if (!response.ok) {
    return Promise.reject();
  }
  return (await response.json()) as Article;
}

export async function getArticles(
  category: string,
  limit: number,
  offset: number
): Promise<ContentLessArticle[]> {
  const response = await fetch(
    `/api/articles?category=${category}&limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    return Promise.reject();
  }
  return (await response.json()) as ContentLessArticle[];
}

export async function postArticle(
  category: string,
  title: string,
  subtitle: string,
  content: string
): Promise<void> {
  const response = await fetch("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      title,
      subtitle,
      content,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function patchArticle(
  uid: number,
  data: {
    category?: string;
    title?: string;
    subtitle?: string;
    content?: string;
  }
): Promise<void> {
  const response = await fetch(`/api/articles/${uid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: data.category,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function deleteArticle(uid: number): Promise<void> {
  const response = await fetch(`/api/articles/${uid}`, { method: "DELETE" });
  if (!response.ok) {
    return Promise.reject();
  }
}
