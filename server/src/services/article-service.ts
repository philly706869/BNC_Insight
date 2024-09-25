import { Category } from "@/database/entities/category";
import {
  articleRepository,
  categoryRepository,
  userRepository,
} from "@/database/repositories";
import { ArticleValue } from "@/database/values/article-values";
import { CategoryValue } from "@/database/values/category-values";
import { ArticleDTO, articleFindSelection } from "@/dto/article-dto";
import {
  ContentlessArticleDTO,
  contentlessArticleFindSelection,
} from "@/dto/contentless-article-dto";

export async function getArticle(id: number): Promise<ArticleDTO | null> {
  const article = await articleRepository.findOne({
    where: { id },
    select: articleFindSelection,
  });
  return article ? ArticleDTO.from(article) : null;
}

export async function getArticles(
  category: Category,
  offset: number,
  limit: number
): Promise<ContentlessArticleDTO[]> {
  limit = Math.min(limit, 30);
  const articles = await articleRepository.find({
    where: { category },
    select: contentlessArticleFindSelection,
    skip: offset,
    take: limit,
  });
  return articles.map((article) => ContentlessArticleDTO.from(article));
}

export async function postArticle(
  uploaderUid: number,
  categoryName: CategoryValue.Name,
  thumbnailUrl: ArticleValue.ThumbnailUrl | null,
  title: ArticleValue.Title,
  subtitle: ArticleValue.Subtitle,
  content: ArticleValue.Content
): Promise<ContentlessArticleDTO> {
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

  return ContentlessArticleDTO.from(await articleRepository.save(article));
}
