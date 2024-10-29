import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "../../components/Quill";
import { Article, getArticle } from "../../services/article-service";
import NotFound from "../NotFound";

export default function ViewArticle() {
  const params = useParams();

  const [article, setArticle] = useState<Article | "not found" | "unloaded">(
    "unloaded"
  );

  useEffect(() => {
    const rawUid = params.uid;
    if (rawUid === undefined) {
      setArticle("not found");
      return;
    }

    const uid = parseInt(rawUid);
    if (isNaN(uid) || uid < 0) {
      setArticle("not found");
      return;
    }

    getArticle(uid)
      .then((article) => {
        setArticle(article);
      })
      .catch(() => {
        setArticle("not found");
      });
  }, [params]);

  if (article === "unloaded") {
    return <p>Loading...</p>;
  }

  if (article === "not found") {
    return <NotFound />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <Quill viewMode />
    </>
  );
}
