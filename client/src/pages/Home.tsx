import { FC, useEffect, useState } from "react";
import { ContentLessArticle, getArticles } from "../services/article-service";

import styles from "../styles/Home.module.scss";

type ArticleProps = {
  className?: string;
  article: ContentLessArticle | undefined;
};

const Article: FC<ArticleProps> = (props) => {
  const { className, article } = props;

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
};

export const Home: FC = () => {
  type Articles = ContentLessArticle[] | undefined;
  const [articles, setArticles] = useState<Articles>(undefined);

  useEffect(() => {
    (async () => {
      const articles = await getArticles({ limit: 4, offset: 0 });
      setArticles(articles.items);
    })();
  }, []);

  return (
    <>
      <div className={styles.articles}>
        {articles !== undefined && (
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
};
