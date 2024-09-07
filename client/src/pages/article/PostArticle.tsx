import Editor from "../../components/Editor";
import { getCategories } from "../../services/articleService";

export default function PostArticle() {
  return (
    <>
      <Editor categories={getCategories()} />
    </>
  );
}
