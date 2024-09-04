import { notFound } from "next/navigation";
import styles from "./page.module.css";

type Props = {
  params: {
    article: string;
  };
};

export default function Article({ params }: Props) {
  const { article } = params;
  if (!/^\d+$/.test(article)) {
    return notFound();
  }
  const articleUid = parseInt(article);

  const title = "Test Title";
  const subtitle = "Test SubTitle";
  const content = "Test Content";

  return (
    <>
      <article className={styles.article}>
        <h1 className={styles.title}>{title}</h1>
        <h3 className={styles.subtitle}>{subtitle}</h3>
        <div className={styles.content}>{content}</div>
        {articleUid}
      </article>
    </>
  );
}
