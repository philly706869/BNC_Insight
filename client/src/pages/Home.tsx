import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.articles}>
        <article className={styles.main}></article>
        <article className={styles.sub1}></article>
        <article className={styles.sub2}></article>
        <article className={styles.sub3}></article>
      </div>
    </>
  );
}
