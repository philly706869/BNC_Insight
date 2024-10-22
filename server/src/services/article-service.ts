import { config } from "@/config";
import { Database } from "@/database/database";
import { articles } from "@/database/tables/article";
import { users } from "@/database/tables/user";
import { ArticleValue } from "@/database/values/article-values";
import { CategoryValue } from "@/database/values/category-values";
import { ArticleDTO } from "@/dto/article-dto";
import { ContentlessArticleDTO } from "@/dto/contentless-article-dto";
import { PublicUserDTO } from "@/dto/public-user-dto";
import {
  ArticleNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
} from "@/errors/service-errors";
import { eq, isNull } from "drizzle-orm";

export class ArticleService {
  public constructor(private readonly database: Database) {}

  /**
   * @throws {ArticleNotFoundError}
   */
  public async getOne(uid: number): Promise<ArticleDTO> {
    const articleArray = await this.database
      .select({
        uid: articles.uid,
        uploaderUsername: users.username,
        uploaderName: users.name,
        category: articles.categoryName,
        thumbnailUrl: articles.thumbnailUrl,
        thumbnailCaption: articles.thumbnailCaption,
        title: articles.title,
        subtitle: articles.subtitle,
        content: articles.content,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(users, eq(users.uid, articles.uploaderUid))
      .where(eq(articles.uid, uid))
      .limit(1)
      .execute();

    if (articleArray.length < 1)
      return Promise.reject(new ArticleNotFoundError());
    const article = articleArray[0];

    return new ArticleDTO({
      ...article,
      uploader:
        article.uploaderUsername && article.uploaderName
          ? new PublicUserDTO({
              username: article.uploaderUsername,
              name: article.uploaderName,
            })
          : null,
      thumbnail: {
        url: article.thumbnailUrl,
        caption: article.thumbnailCaption,
      },
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  }

  /**
   * @throws {QueryLimitOutOfBoundsError}
   * @throws {QueryOffsetOutOfBoundsError}
   */
  public async getMany(
    categoryName: CategoryValue.Name | null | undefined,
    offset: number | undefined,
    limit: number | undefined
  ): Promise<ContentlessArticleDTO[]> {
    if (limit) {
      if (limit < 1) return Promise.reject(new QueryLimitOutOfBoundsError());
      if (limit > config.article.maxQueryLimit)
        return Promise.reject(new QueryLimitOutOfBoundsError());
    } else limit = config.article.maxQueryLimit;

    if (offset) {
      if (offset < 0) return Promise.reject(new QueryOffsetOutOfBoundsError());
    } else offset = 0;

    const articleArray = await this.database
      .select({
        uid: articles.uid,
        uploaderUsername: users.username,
        uploaderName: users.name,
        category: articles.categoryName,
        thumbnailUrl: articles.thumbnailUrl,
        thumbnailCaption: articles.thumbnailCaption,
        title: articles.title,
        subtitle: articles.subtitle,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(users, eq(users.uid, articles.uploaderUid))
      .where(
        categoryName
          ? eq(articles.categoryName, categoryName.value)
          : isNull(articles.categoryName)
      )
      .limit(limit)
      .offset(offset)
      .execute();

    return articleArray.map(
      (article) =>
        new ContentlessArticleDTO({
          ...article,
          uploader:
            article.uploaderUsername && article.uploaderName
              ? new PublicUserDTO({
                  username: article.uploaderUsername,
                  name: article.uploaderName,
                })
              : null,
          thumbnail: {
            url: article.thumbnailUrl,
            caption: article.thumbnailCaption,
          },
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
        })
    );
  }

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
  ): Promise<void> {
    await this.database
      .insert(articles)
      .values({
        uploaderUid,
        categoryName: categoryName?.value ?? null,
        thumbnailUrl:
          thumbnail?.url.value ?? config.article.defaultThumbnailUrl,
        thumbnailCaption: thumbnail?.caption.value ?? "",
        title: title.value,
        subtitle: subtitle.value,
        content: content.value,
      })
      .execute();
  }

  public async patch(
    uid: number,
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
    await this.database
      .update(articles)
      .set({
        categoryName: data.categoryName?.value,
        thumbnailUrl: data.thumbnail?.url.value,
        thumbnailCaption: data.thumbnail?.caption.value,
        title: data.title?.value,
        subtitle: data.subtitle?.value,
        content: data.content?.value,
      })
      .where(eq(articles.uid, uid))
      .execute();
  }

  public async delete(uid: number): Promise<void> {
    await this.database.delete(articles).where(eq(articles.uid, uid)).execute();
  }
}
