import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <div className={styles.container}>
        <span className={styles.message}>404 Not Found</span>
      </div>
    </>
  );
}
