import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryContext } from "../contexts/CategoryContext";
import { ContentLessArticle } from "../services/article-service";

export default function Category() {
  const params = useParams();
  const categories = useContext(CategoryContext);

  const [articles, setArticles] = useState<ContentLessArticle[] | "unloaded">(
    "unloaded"
  );

  useEffect(() => {
    if (categories.isInitialized) {
    }
  }, [params, categories]);

  return <></>;
}
