import { Article } from "@/database/entities/article";
import { Category } from "@/database/entities/category";
import {
  articleRepository,
  categoryRepository,
  userRepository,
} from "@/database/repositories";
import { ArticleValue } from "@/database/values/article-values";
import { CategoryValue } from "@/database/values/category-values";
import { FindOptionsSelect } from "typeorm";

const getArticleSelection: FindOptionsSelect<Article> = {
  id: true,
  category: { name: true },
  thumbnailUrl: true,
  title: true,
  subtitle: true,
  content: true,
  uploader: { username: true, name: true },
  createdAt: true,
  updatedAt: true,
};

export async function getArticle(id: number): Promise<Article | null> {
  return await articleRepository.findOne({
    where: { id },
    select: getArticleSelection,
  });
}

const getArticlesSelection: FindOptionsSelect<Article> = {
  id: true,
  category: { name: true },
  thumbnailUrl: true,
  title: true,
  subtitle: true,
  uploader: { username: true, name: true },
  createdAt: true,
  updatedAt: true,
};

export async function getArticles(
  category: Category,
  offset: number,
  limit: number
): Promise<Article[]> {
  limit = Math.min(limit, 30);
  return await articleRepository.find({
    where: { category },
    select: getArticlesSelection,
    skip: offset,
    take: limit,
  });
}

export async function postArticle(
  uploaderUid: number,
  categoryName: CategoryValue.Name,
  thumbnailUrl: ArticleValue.ThumbnailUrl | null,
  title: ArticleValue.Title,
  subtitle: ArticleValue.Subtitle,
  content: ArticleValue.Content
): Promise<Article> {
  const uploader = await userRepository.findOne({
    where: { uid: uploaderUid },
    select: { uid: true },
  });
  if (!uploader) throw new Error();

  const category = await categoryRepository.findOne({
    where: { name: categoryName.value },
    select: { name: true },
  });
  if (!category) throw new Error();

  const article = articleRepository.create({
    uploader: uploader,
    category: category,
    thumbnailUrl: thumbnailUrl?.value,
    title: title.value,
    subtitle: subtitle.value,
    content: content.value,
  });

  return await articleRepository.save(article);
}
