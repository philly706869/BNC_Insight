import styles from "../styles/MyArticles.module.scss";

import { FC } from "react";
import { Link } from "react-router-dom";

export const MyArticles: FC = () => {
  return (
    <>
      <Link className={styles["post-article-button"]} to="/article/write">
        Post Article
      </Link>
    </>
  );
};
