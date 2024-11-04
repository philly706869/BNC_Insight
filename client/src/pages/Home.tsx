import { useEffect, useState } from "react";
import { ContentLessArticle, getArticles } from "../services/article-service";
import styles from "../styles/Home.module.css";

function Article({
  className,
  article,
}: {
  className?: string;
  article: ContentLessArticle | undefined;
}) {
  return (
    <article className={className}>
      {article && (
        <>
          <figure>
            <img alt="Thumbnail" src={article.thumbnail.url}></img>
          </figure>
          <section>
            <h2>{article.title}</h2>
            {article.subtitle && <p>{article.subtitle}</p>}
            <span>By {article.uploader?.name ?? "Deleted User"}</span>
            <time>{new Date(article.createdAt).toDateString()}</time>
          </section>
        </>
      )}
    </article>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<ContentLessArticle[] | null>(null);

  useEffect(() => {
    getArticles({ limit: 4, offset: 0 }).then(({ items: articles }) => {
      setArticles(articles);
    });
  }, []);

  return (
    <>
      <div className={styles.articles}>
        {articles === null ? (
          <p>Loading articles...</p>
        ) : (
          <>
            <Article className={styles.main} article={articles.at(0)} />
            <Article className={styles.sub1} article={articles.at(1)} />
            <Article className={styles.sub2} article={articles.at(2)} />
            <Article className={styles.sub3} article={articles.at(3)} />
          </>
        )}
      </div>
    </>
  );
}
