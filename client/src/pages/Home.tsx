import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { ContentLessArticle, getArticles } from "../services/article-service";

import styles from "../styles/Home.module.scss";
import { getTimeData } from "../utils/time";

type ArticleProps = {
  article: ContentLessArticle;
};

const Article: FC<ArticleProps> = (props) => {
  const { article } = props;
  const [dateTime, dateString, dateTitle] = useMemo(() => {
    const date = new Date(article.createdAt);
    return getTimeData(date);
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
        <span>{article.uploader?.name ?? "삭제된 유저"} 작성</span>
        <time dateTime={dateTime} title={dateTitle}>
          {dateString}
        </time>
      </footer>
    </article>
  );
};

const ARTICLE_LIMIT = 5;
const MAIN_ARTICLE_AMOUNT = 2;

export const Home: FC = () => {
  type Articles = Awaited<ReturnType<typeof getArticles>> | undefined;
  const [articles, setArticles] = useState<Articles>(undefined);
  const [mainArticles, subArticles] = useMemo(() => {
    if (articles === undefined) return [[], []];
    const items = articles.items;
    const mainArticles = items.slice(0, MAIN_ARTICLE_AMOUNT);
    const subArticles = items.slice(MAIN_ARTICLE_AMOUNT);
    return [mainArticles, subArticles];
  }, [articles]);

  useEffect(() => {
    (async () => {
      const articles = await getArticles({ limit: ARTICLE_LIMIT, offset: 0 });
      setArticles(articles);
    })();
  }, []);

  return (
    <>
      <div className={styles["article-container"]}>
        <main>
          {(() => {
            const nodes: ReactNode[] = [];
            if (mainArticles.length > 0) {
              const firstArticle = mainArticles[0];
              nodes.push(
                <Article key={firstArticle.uid} article={firstArticle} />
              );
              for (const article of mainArticles.slice(1)) {
                nodes.push(
                  <hr
                    key={`hr${article.uid}`}
                    className={styles["horizental-divider"]}
                  />
                );
                nodes.push(<Article key={article.uid} article={article} />);
              }
            }
            return nodes;
          })()}
        </main>
        <hr className={styles["vertical-divider"]} />
        <aside>
          {(() => {
            const nodes: ReactNode[] = [];
            if (subArticles.length > 0) {
              const firstArticle = subArticles[0];
              nodes.push(
                <Article key={firstArticle.uid} article={firstArticle} />
              );
              for (const article of subArticles.slice(1)) {
                nodes.push(
                  <hr
                    key={`hr${article.uid}`}
                    className={styles["horizental-divider"]}
                  />
                );
                nodes.push(<Article key={article.uid} article={article} />);
              }
            }
            return nodes;
          })()}
        </aside>
      </div>
    </>
  );
};
