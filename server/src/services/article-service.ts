import { config } from "@/config";
import { Database } from "@/database/database";
import { articleTable } from "@/database/tables/article";
import { userTable } from "@/database/tables/user";
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
    const article = (
      await this.database
        .select({
          uid: articleTable.uid,
          uploaderUsername: userTable.username,
          uploaderName: userTable.name,
          category: articleTable.categoryName,
          thumbnailUrl: articleTable.thumbnailUrl,
          thumbnailCaption: articleTable.thumbnailCaption,
          title: articleTable.title,
          subtitle: articleTable.subtitle,
          content: articleTable.content,
          createdAt: articleTable.createdAt,
          updatedAt: articleTable.updatedAt,
        })
        .from(articleTable)
        .leftJoin(userTable, eq(userTable.uid, articleTable.uploaderUid))
        .where(eq(articleTable.uid, uid))
        .execute()
    ).at(0);

    if (!article) {
      return Promise.reject(new ArticleNotFoundError());
    }

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
    if (limit !== undefined) {
      if (limit < 1) {
        return Promise.reject(new QueryLimitOutOfBoundsError());
      }
      if (limit > config.article.maxQueryLimit) {
        return Promise.reject(new QueryLimitOutOfBoundsError());
      }
    } else {
      limit = config.article.maxQueryLimit;
    }

    if (offset !== undefined) {
      if (offset < 0) {
        return Promise.reject(new QueryOffsetOutOfBoundsError());
      }
    } else {
      offset = 0;
    }

    const articles = await this.database
      .select({
        uid: articleTable.uid,
        uploaderUsername: userTable.username,
        uploaderName: userTable.name,
        category: articleTable.categoryName,
        thumbnailUrl: articleTable.thumbnailUrl,
        thumbnailCaption: articleTable.thumbnailCaption,
        title: articleTable.title,
        subtitle: articleTable.subtitle,
        createdAt: articleTable.createdAt,
        updatedAt: articleTable.updatedAt,
      })
      .from(articleTable)
      .leftJoin(userTable, eq(userTable.uid, articleTable.uploaderUid))
      .where(
        categoryName
          ? eq(articleTable.categoryName, categoryName.value)
          : isNull(articleTable.categoryName)
      )
      .limit(limit)
      .offset(offset)
      .execute();

    return articles.map(
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
      .insert(articleTable)
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

  /**
   * @throws {ArticleNotFoundError}
   */
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
    const [header] = await this.database
      .update(articleTable)
      .set({
        categoryName: data.categoryName?.value,
        thumbnailUrl: data.thumbnail?.url.value,
        thumbnailCaption: data.thumbnail?.caption.value,
        title: data.title?.value,
        subtitle: data.subtitle?.value,
        content: data.content?.value,
      })
      .where(eq(articleTable.uid, uid))
      .execute();

    if (!Boolean(header.affectedRows)) {
      return Promise.reject(new ArticleNotFoundError());
    }
  }

  /**
   * @throws {ArticleNotFoundError}
   */
  public async delete(uid: number): Promise<void> {
    const [header] = await this.database
      .delete(articleTable)
      .where(eq(articleTable.uid, uid))
      .execute();

    if (!Boolean(header.affectedRows)) {
      return Promise.reject(new ArticleNotFoundError());
    }
  }
}
