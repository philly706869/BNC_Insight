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
      {article ? (
        <>
          <h1>{article.title}</h1>
          <h2>{article.subtitle}</h2>
          <span>By {article.uploader?.name ?? "Deleted User"}</span>
          <img alt="Thumbnail" src={article.thumbnail.url}></img>
          <time>{new Date(article.createdAt).toDateString()}</time>
        </>
      ) : (
        <p>Empty article</p>
      )}
    </article>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<ContentLessArticle[] | null>(null);

  useEffect(() => {
    getArticles(null, 4, 0).then((articles) => {
      setArticles(articles);
    });
  }, []);

  return (
    <>
      <div className={styles.articles}>
        <Article className={styles.main} article={articles?.at(0)} />
        <Article className={styles.sub1} article={articles?.at(1)} />
        <Article className={styles.sub2} article={articles?.at(2)} />
        <Article className={styles.sub3} article={articles?.at(3)} />
      </div>
    </>
  );
}
