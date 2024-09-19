import { Article } from "@/database/models/Article";
import { Category } from "@/database/models/Category";
import { articleRepository, categoryRepository } from "@/database/repositories";
import { findCategoryByName } from "./categoryService";

export async function findArticleById(id: number): Promise<Article | null> {
  return await articleRepository.findOne({ where: { id } });
}

export async function findArticles(
  categoryName: string,
  offset: number,
  limit: number
): Promise<Article[]> {
  limit = Math.min(limit, 30);
  const category = await categoryRepository.findOne({
    where: { name: categoryName },
  });
  if (!category) return [];
  return await articleRepository.find({
    select: [
      "id",
      "category",
      "thumbnailUrl",
      "title",
      "subtitle",
      "uploader",
      "createdAt",
      "views",
    ],
    where: { category },
    skip: offset,
    take: limit,
  });
}

export type ArticlePostErrorDetails = {
  field: "categoryName" | "thumbnailUrl" | "title" | "subtitle" | "content";
  message: string;
}[];

export class ArticlePostError {
  declare details: ArticlePostErrorDetails;
  constructor(details: ArticlePostErrorDetails) {
    this.details = details;
  }
}

export async function postArticle(
  categoryName: string,
  thumbnailUrl: string | null,
  title: string,
  subtitle: string,
  content: any
) {
  const errors: ArticlePostErrorDetails = [];

  const categoryError = Category.verifyName(categoryName);
  const category = categoryError
    ? (() => {
        errors.push({
          field: "categoryName",
          message: categoryError,
        });
        return null;
      })()
    : await findCategoryByName(categoryName);
  if (!category)
    errors.push({
      field: "categoryName",
      message: "Category is not found.",
    });

  if (thumbnailUrl) {
    const thumbnailUrlError = Article.verifyThumbnailUrl(thumbnailUrl);
    if (thumbnailUrlError)
      errors.push({ field: "thumbnailUrl", message: thumbnailUrlError });
  }

  const titleError = Article.verifyTitle(title);
  if (titleError)
    errors.push({
      field: "title",
      message: titleError,
    });

  const subtitleError = Article.verifySubtitle(subtitle);
  if (subtitleError)
    errors.push({
      field: "subtitle",
      message: subtitleError,
    });

  if (errors.length) throw new ArticlePostError(errors);

  const article = new Article();
  article.category = category!;
  await articleRepository.save();
}
