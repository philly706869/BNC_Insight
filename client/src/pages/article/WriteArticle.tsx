import { FC, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleEditor } from "../../components/ArticleEditor";
import { CategoryContext } from "../../contexts/category-context";

export const WriteArticle: FC = () => {
  const [searchParams] = useSearchParams();

  const override: number | undefined = useMemo(() => {
    const raw = searchParams.get("override");
    if (raw === null) {
      return undefined;
    }

    const override = parseInt(raw);
    if (isNaN(override) || override < 0) {
      return undefined;
    }

    return override;
  }, [searchParams]);

  const categories = useContext(CategoryContext);
  const categoryNames = useMemo(() => {
    if (categories === undefined) {
      return undefined;
    }
    return categories.map((category) => category.name);
  }, [categories]);

  return (
    <>
      {categoryNames !== undefined && (
        <>
          <ArticleEditor mode="edit" categories={categoryNames} />
        </>
      )}
      {/* <button
        onClick={async () => {
          const quill = quillRef.current!;
          const editor = quill.getEditor();
          const content = editor.getContents();
          try {
            const aritcle = await postArticle(
              category === "" ? null : category,
              thumbnail,
              title,
              subtitle,
              JSON.stringify(content)
            );
            navigate(`/article/${aritcle.uid}`);
            navigate(0);
          } catch (error: any) {
            console.log(error);
            if (error.details) {
              for (const issue of error.details as {
                path: string[];
                message: string;
              }[]) {
                if (issue.path.includes("caption")) {
                  setThumnailCaptionMessage(issue.message);
                } else if (issue.path.includes("title")) {
                  setTitleMessage(issue.message);
                } else if (issue.path.includes("subtitle")) {
                  setSubtitleMessage(issue.message);
                } else if (issue.path.includes("content")) {
                  alert(issue.message);
                } else {
                  alert("Unknown error occured while uploading article");
                  break;
                }
              }
            } else {
              alert("Unknown error occured while uploading article");
            }
          }
        }}
      >
        Upload
      </button> */}
    </>
  );
};
