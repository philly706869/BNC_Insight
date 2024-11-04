import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ContentLessArticle, getArticles } from "../services/article-service";

export default function Category() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<ContentLessArticle[]>([]);

  useEffect(() => {
    const rawPage = searchParams.get("page");
    const page = rawPage !== null ? Number(rawPage) : NaN;
    if (isNaN(page) || page < 1) {
      searchParams.set("page", "1");
      setSearchParams(searchParams);
      setPage(1);
    } else {
      setPage(page);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const category = params.category;

    getArticles({
      category: category ?? null,
      limit: 30,
      offset: 30 * (page - 1),
    })
      .then(({ items: articles }) => {
        setArticles(articles);
      })
      .catch(() => {
        setArticles([]);
      });
  }, [page, params.category]);

  return (
    <>
      {articles.length === 0 ? (
        <>
          <h2>Article does not exists</h2>
        </>
      ) : (
        <ol>
          {articles.map((article) => (
            <>
              <li>
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
  );
}
