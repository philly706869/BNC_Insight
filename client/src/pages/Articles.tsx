import { FC, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentLessArticle, getArticles } from "../services/article-service";

export const Articles: FC = () => {
  const [searchParams] = useSearchParams();

  const category: string | null = useMemo(() => {
    return searchParams.get("category");
  }, [searchParams]);

  const page: number = useMemo(() => {
    const param = searchParams.get("page");
    if (param === null) {
      return 1;
    }
    const page = parseInt(param);
    if (isNaN(page) || page < 1) {
      return NaN;
    }
    return page;
  }, [searchParams]);

  const [articles, setArticles] = useState<
    | { state: "UNSET" }
    | { state: "ERROR" }
    | {
        state: "SET";
        data: { total: number; items: ContentLessArticle[] };
      }
  >({ state: "UNSET" });

  useEffect(() => {
    (async () => {
      if (isNaN(page)) {
        return;
      }

      try {
        const articles = await getArticles({
          category: category,
          limit: 30,
          offset: 30 * (page - 1),
        });
        setArticles({
          state: "SET",
          data: articles,
        });
      } catch {
        setArticles({
          state: "ERROR",
        });
      }
    })();
  }, [page, category]);

  return (
    <>
      {articles.state === "SET" && (
        <>
          {articles.data.items.length === 0 ? (
            <>
              <h2>Article does not exists</h2>
            </>
          ) : (
            <ol>
              {articles.data.items.map((article) => (
                <>
                  <li key={article.uid}>
                    <img alt="Thumbnail" src={article.thumbnail.url} />
                    <h1>{article.title}</h1>
                    <h2>{article.subtitle}</h2>
                    <span>By {article.uploader?.name ?? "Deleted User"}</span>
                    <time>{new Date(article.createdAt).toDateString()}</time>
                  </li>
                </>
              ))}
            </ol>
          )}
        </>
      )}
    </>
  );
};