import { FC, useEffect, useMemo, useState } from "react";
import { ContentLessArticle, getArticles } from "../services/article-service";

import styles from "../styles/Home.module.scss";

type ArticleProps = {
  article: ContentLessArticle;
};

const Article: FC<ArticleProps> = (props) => {
  const { article } = props;
  const [dateTime, dateString] = useMemo(() => {
    const date = new Date(article.createdAt);
    const dateTime = date.toISOString().split(`T`)[0];
    const dateString = date.toDateString();
    return [dateTime, dateString];
  }, [article.createdAt]);

  return (
    <article className={styles.article}>
      <a className={styles["article-anchor"]} href={`/article/${article.uid}`}>
        <figure className={styles.thumbnail}>
          <img
            alt={article.thumbnail.caption}
            src={article.thumbnail.url}
          ></img>
        </figure>
        <header>
          <h2 className={styles.title}>{article.title}</h2>
        </header>
        <main>
          {article.subtitle && (
            <p className={styles.subtitle}>{article.subtitle}</p>
          )}
        </main>
      </a>
      <footer className={styles.footer}>
        <span>By {article.uploader?.name ?? "Deleted User"}</span>
        <time dateTime={dateTime}>{dateString}</time>
      </footer>
    </article>
  );
};

export const Home: FC = () => {
  type Articles = Awaited<ReturnType<typeof getArticles>> | undefined;
  const [articles, setArticles] = useState<Articles>(undefined);
  const [mainArticles, subArticles] = useMemo(() => {
    if (articles === undefined) return [[], []];
    const items = articles.items;
    const mainArticles = items.slice(0, 2);
    const subArticles = items.slice(2);
    return [mainArticles, subArticles];
  }, [articles]);

  useEffect(() => {
    (async () => {
      const articles = await getArticles({ limit: 4, offset: 0 });
      setArticles(articles);
    })();
  }, []);

  return (
    <>
      <div className={styles["article-container"]}>
        <main>
          {mainArticles
            .map((article) => [
              <hr className={styles["horizental-divider"]} />,
              <Article article={article} />,
            ])
            .flat(1)
            .slice(1)}
        </main>
        <hr className={styles["vertical-divider"]} />
        <aside>
          {subArticles
            .map((article) => [
              <hr className={styles["horizental-divider"]} />,
              <Article article={article} />,
            ])
            .flat(1)
            .slice(1)}
        </aside>
      </div>
    </>
  );
};
