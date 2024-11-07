import { config } from "@/config";
import { Database } from "@/database/database";
import { articleTable } from "@/database/tables/article-table";
import { categoryTable } from "@/database/tables/category-table";
import { userTable } from "@/database/tables/user-table";
import { ArticleDTO } from "@/dto/article-dto";
import { ContentlessArticleDTO } from "@/dto/contentless-article-dto";
import { PublicUserDTO } from "@/dto/public-user-dto";
import {
  ArticleNotFoundError,
  CategoryNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { ArticleValue } from "@/value-objects/article-values";
import { CategoryValue } from "@/value-objects/category-values";
import { and, count, desc, eq, isNull, SQL, sql } from "drizzle-orm";

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

    if (article === undefined) {
      return Promise.reject(new ArticleNotFoundError("Article not found"));
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
   * @throws {UserNotFoundError}
   * @throws {CategoryNotFoundError}
   */
  public async getMany(query: {
    uploaderUsername?: string;
    categoryName?: string | null;
    offset?: number;
    limit?: number;
  }): Promise<{ total: number; items: ContentlessArticleDTO[] }> {
    const limit = await (async () => {
      const limit = query.limit;
      if (limit === undefined) {
        return config.article.maxQueryLimit;
      }
      const min = 1;
      const max = config.article.maxQueryLimit;
      if (limit < min || limit > max) {
        return Promise.reject(
          new QueryLimitOutOfBoundsError(
            `Query limit must be between ${min} and ${max}, inclusive`
          )
        );
      }
      return limit;
    })();

    const offset = await (async () => {
      const offset = query.offset;
      if (offset === undefined) {
        return 0;
      }
      if (offset < 0) {
        return Promise.reject(
          new QueryOffsetOutOfBoundsError(
            `Query offset must be greater than or equal to 0`
          )
        );
      }
      return offset;
    })();

    const uploaderUid: number | undefined = await (async () => {
      const uploaderUsername = query.uploaderUsername;
      if (uploaderUsername === undefined) {
        return undefined;
      }

      const uploader = (
        await this.database
          .select({ uid: userTable.uid })
          .from(userTable)
          .where(eq(userTable.username, uploaderUsername))
          .execute()
      ).at(0);
      if (uploader === undefined) {
        return Promise.reject(new UserNotFoundError(""));
      }
      return uploader.uid;
    })();

    const categoryName: string | null | undefined = await (async () => {
      const categoryName = query.categoryName;
      if (categoryName === undefined || categoryName === null) {
        return categoryName;
      }

      const category = (
        await this.database
          .select({ exists: sql<1>`1` })
          .from(categoryTable)
          .where(eq(categoryTable.name, categoryName))
          .execute()
      ).at(0);
      if (category === undefined) {
        return Promise.reject(new CategoryNotFoundError(""));
      }

      return categoryName;
    })();

    const conditions: SQL[] = [];
    if (uploaderUid !== undefined) {
      conditions.push(eq(articleTable.uploaderUid, uploaderUid));
    }
    if (categoryName !== undefined) {
      if (categoryName !== null) {
        conditions.push(eq(articleTable.categoryName, categoryName));
      } else {
        conditions.push(isNull(articleTable.categoryName));
      }
    }
    const condition = and(...conditions);

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
      .limit(limit)
      .offset(offset)
      .orderBy(desc(articleTable.createdAt))
      .where(condition)
      .execute();

    const total = (
      await this.database
        .select({ count: count() })
        .from(articleTable)
        .where(condition)
        .execute()
    )[0].count;

    return {
      total,
      items: articles.map(
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
      ),
    };
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
  ): Promise<{ uid: number }> {
    const article = (
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
        .$returningId()
        .execute()
    )[0];

    return { uid: article.uid };
  }

  /**
   * @throws {UserNotFoundError}
   * @throws {ArticleNotFoundError}
   */
  public async patch(
    userUid: number,
    articleUid: number,
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
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError("User not found"));
    }

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
      .where(
        user.isAdmin
          ? eq(articleTable.uid, articleUid)
          : and(
              eq(articleTable.uid, articleUid),
              eq(articleTable.uploaderUid, userUid)
            )
      )
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new ArticleNotFoundError("Article not found"));
    }
  }

  /**
   * @throws {UserNotFoundError}
   * @throws {ArticleNotFoundError}
   */
  public async delete(userUid: number, articleUid: number): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError(""));
    }

    const [header] = await this.database
      .delete(articleTable)
      .where(
        user.isAdmin
          ? eq(articleTable.uid, articleUid)
          : and(
              eq(articleTable.uid, articleUid),
              eq(articleTable.uploaderUid, userUid)
            )
      )
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new ArticleNotFoundError(""));
    }
  }
}
