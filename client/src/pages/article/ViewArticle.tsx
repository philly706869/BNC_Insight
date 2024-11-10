import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article, getArticle } from "../../services/article-service";
import { NotFound } from "../NotFound";

export const ViewArticle: FC = () => {
  const params = useParams();

  type ArticleState =
    | { state: "UNSET" }
    | { state: "NOT_FOUND" }
    | { state: "SET"; data: Article };
  const [article, setArticle] = useState<ArticleState>({ state: "UNSET" });

  useEffect(() => {
    (async () => {
      const rawUid = params.uid;
      if (rawUid === undefined) {
        setArticle({ state: "NOT_FOUND" });
        return;
      }

      const uid = parseInt(rawUid);
      if (isNaN(uid) || uid < 0) {
        setArticle({ state: "NOT_FOUND" });
        return;
      }

      try {
        const article = await getArticle(uid);
        setArticle({ state: "SET", data: article });
      } catch {
        setArticle({ state: "NOT_FOUND" });
      }
    })();
  }, [params]);

  switch (article.state) {
    case "UNSET":
      return <></>;

    case "NOT_FOUND":
      return <NotFound />;

    case "SET":
      return (
        <>
          <h1>{article.data.title}</h1>
        </>
      );
  }
  article satisfies never;
};
