import { Article } from "@/database/entities/article";
import { Category } from "@/database/entities/category";
import { User } from "@/database/entities/user";
import { ArticleValue } from "@/database/values/article-values";
import { CategoryValue } from "@/database/values/category-values";
import { ArticleDTO, articleFindSelection } from "@/dto/article-dto";
import {
  ContentlessArticleDTO,
  contentlessArticleFindSelection,
} from "@/dto/contentless-article-dto";
import { env } from "@/env";
import {
  ArticleNotFoundError,
  CategoryNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { DataSource, IsNull, Repository } from "typeorm";

export class ArticleService {
  private readonly userRepository: Repository<User>;
  private readonly categoryRepository: Repository<Category>;
  private readonly articleRepository: Repository<Article>;

  public constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.categoryRepository = dataSource.getRepository(Category);
    this.articleRepository = dataSource.getRepository(Article);
  }

  /**
   * @throws {ArticleNotFoundError}
   */
  public async getOne(id: number): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOne({
      where: { id },
      select: articleFindSelection,
    });
    if (!article) return Promise.reject(new ArticleNotFoundError());
    return ArticleDTO.from(article);
  }

  /**
   * @throws {QueryLimitOutOfBoundsError}
   * @throws {QueryOffsetOutOfBoundsError}
   * @throws {CategoryNotFoundError}
   */
  public async getMany(
    categoryName: CategoryValue.Name | null,
    offset: number | undefined,
    limit: number | undefined
  ): Promise<ContentlessArticleDTO[]> {
    if (limit) {
      if (limit < 1) return Promise.reject(new QueryLimitOutOfBoundsError());
      if (limit > env.article.maxQueryLimit)
        return Promise.reject(new QueryLimitOutOfBoundsError());
    } else limit = env.article.maxQueryLimit;

    if (offset) {
      if (offset < 0) return Promise.reject(new QueryOffsetOutOfBoundsError());
    } else offset = 0;

    let category: Category | null = null;
    if (categoryName) {
      const foundCategory = await this.categoryRepository.findOne({
        where: { name: categoryName.value },
        select: { name: true },
      });
      if (!foundCategory) return Promise.reject(new CategoryNotFoundError());
      category = foundCategory;
    }

    const articles = await this.articleRepository.find({
      where: { category: category ?? IsNull() },
      select: contentlessArticleFindSelection,
      skip: offset,
      take: limit,
    });
    return articles.map((article) => ContentlessArticleDTO.from(article));
  }

  /**
   * @throws {UserNotFoundError}
   * @throws {CategoryNotFoundError}
   */
  public async post(
    uploaderUid: number,
    categoryName: CategoryValue.Name | null,
    thumbnail: {
      url: ArticleValue.ThumbnailUrl;
      caption: ArticleValue.ThumbnailCaption;
    } | null,
    title: ArticleValue.Title,
    subtitle: ArticleValue.Subtitle,
    content: ArticleValue.Content
  ): Promise<ContentlessArticleDTO> {
    const uploader = await this.userRepository.findOne({
      where: { uid: uploaderUid },
      select: { uid: true },
    });
    if (!uploader) return Promise.reject(new UserNotFoundError());

    let category: Category | null = null;
    if (categoryName) {
      const foundCategory = await this.categoryRepository.findOne({
        where: { name: categoryName.value },
        select: { name: true },
      });
      if (!foundCategory) return Promise.reject(new CategoryNotFoundError());
      category = foundCategory;
    }

    const article = await this.articleRepository.save(
      this.articleRepository.create({
        uploader: uploader,
        category: category,
        thumbnailUrl: thumbnail?.url.value,
        thumbnailCaption: thumbnail?.caption.value,
        title: title.value,
        subtitle: subtitle.value,
        content: content.value,
      })
    );

    return ContentlessArticleDTO.from(article);
  }

  /**
   * @throws {CategoryNotFoundError}
   * @throws {ArticleNotFoundError}
   */
  public async patch(
    id: number,
    data: {
      categoryName?: CategoryValue.Name;
      thumbnail?: {
        url: ArticleValue.ThumbnailUrl;
        caption: ArticleValue.ThumbnailCaption;
      } | null;
      title?: ArticleValue.Title;
      subtitle?: ArticleValue.Subtitle;
      content?: ArticleValue.Content;
    }
  ): Promise<void> {
    let category: Category | undefined = undefined;
    if (data.categoryName) {
      const category = await this.categoryRepository.findOne({
        where: { name: data.categoryName?.value },
      });
      if (!category) return Promise.reject(new CategoryNotFoundError());
    }

    const result = await this.articleRepository.update(
      { id },
      {
        category,
        thumbnailUrl:
          data.thumbnail !== undefined
            ? data.thumbnail?.url.value ?? env.thumbnail.defaultUrl
            : undefined,
        thumbnailCaption:
          data.thumbnail !== undefined
            ? data.thumbnail?.caption.value ?? ""
            : undefined,
        title: data.title?.value,
        subtitle: data.subtitle?.value,
        content: data.content?.value,
      }
    );

    if (!Boolean(result.affected))
      return Promise.reject(new ArticleNotFoundError());
  }

  /**
   * @throws {ArticleNotFoundError}
   */
  public async delete(id: number): Promise<void> {
    const result = await this.articleRepository.delete({ id });
    if (!Boolean(result.affected))
      return Promise.reject(new ArticleNotFoundError());
  }
}
