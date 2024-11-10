import { FC } from "react";
import { Link } from "react-router-dom";

export const MyArticles: FC = () => {
  return (
    <>
      <Link to="/article/write">New Article</Link>
    </>
  );
};
