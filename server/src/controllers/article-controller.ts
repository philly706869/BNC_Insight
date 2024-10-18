import { CategoryValue } from "@/database/values/category-values";
import {
  ArticleNotFoundError,
  CategoryNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { ArticleService } from "@/services/article-service";
import { ArticleValueTransformer } from "@/utils/zod/article-value-transformers";
import { CategoryValueTransformer } from "@/utils/zod/category-value-transformers";
import { Request, Response } from "express";
import { z } from "zod";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  private static readonly paramsSchema = z.object({
    id: z.coerce.number().int().nonnegative(),
  });

  public async getOne(req: Request, res: Response): Promise<void> {
    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);

    if (!paramsParseResult.success) {
      res.status(400).end();
      return;
    }

    const params = paramsParseResult.data;

    try {
      const articleDTO = await this.articleService.getOne(params.id);
      res.status(200).json(articleDTO);
    } catch (error) {
      if (error instanceof ArticleNotFoundError) res.status(404).end();
      else return Promise.reject(error);
    }
  }

  private static readonly getManyQuerySchema = z.object({
    category: z
      .string()
      .transform((arg, ctx) => {
        const categoryName = CategoryValue.Name.verify(arg);
        if (!categoryName) {
          ctx.addIssue({ code: "custom" });
          return z.NEVER;
        }
        return categoryName;
      })
      .nullable(),
    offset: z.number().int().optional(),
    limit: z.number().int().optional(),
  });

  public async getMany(req: Request, res: Response): Promise<void> {
    const queryParseResult =
      await ArticleController.getManyQuerySchema.safeParseAsync(req.query);

    if (!queryParseResult.success) {
      res.status(400).end();
      return;
    }

    const query = queryParseResult.data;

    try {
      const articlesDTO = await this.articleService.getMany(
        query.category,
        query.offset,
        query.limit
      );
      res.status(200).json(articlesDTO);
    } catch (error) {
      if (error instanceof QueryOffsetOutOfBoundsError) res.status(400).end();
      else if (error instanceof QueryLimitOutOfBoundsError)
        res.status(400).end();
      else if (error instanceof CategoryNotFoundError) res.status(400).end();
      else return Promise.reject(error);
    }
  }

  private static readonly postBodySchema = z.object({
    category: z.string().transform(CategoryValueTransformer.name).nullable(),
    thumbnail: z
      .object({
        url: z.string().transform(ArticleValueTransformer.thumbnailUrl),
        caption: z.string().transform(ArticleValueTransformer.thumbnailCaption),
      })
      .nullable(),
    title: z.string().transform(ArticleValueTransformer.title),
    subtitle: z.string().transform(ArticleValueTransformer.subtitle),
    content: z.string().transform(ArticleValueTransformer.content),
  });

  public async post(req: Request, res: Response): Promise<void> {
    const uploaderUid = req.session.userUid;
    if (!uploaderUid) return Promise.reject();

    const bodyParseResult =
      await ArticleController.postBodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }

    const body = bodyParseResult.data;

    try {
      await this.articleService.post(
        uploaderUid,
        body.category,
        body.thumbnail,
        body.title,
        body.subtitle,
        body.content
      );
    } catch (error) {
      if (error instanceof UserNotFoundError) res.status(404).end();
      else if (error instanceof CategoryNotFoundError) res.status(400).end();
      else return Promise.reject(error);
    }
  }

  private static readonly patchBodySchema = z.object({
    category: z
      .string()
      .transform(CategoryValueTransformer.name)
      .nullable()
      .optional(),
    thumbnail: z
      .object({
        url: z.string().transform(ArticleValueTransformer.thumbnailUrl),
        caption: z.string().transform(ArticleValueTransformer.thumbnailCaption),
      })
      .nullable()
      .optional(),
    title: z.string().transform(ArticleValueTransformer.title).optional(),
    subtitle: z.string().transform(ArticleValueTransformer.subtitle).optional(),
    content: z.string().transform(ArticleValueTransformer.content).optional(),
  });

  public async patch(req: Request, res: Response): Promise<void> {
    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      res.status(400).end();
      return;
    }

    const bodyParseResult =
      await ArticleController.patchBodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }

    const params = paramsParseResult.data;
    const body = bodyParseResult.data;

    try {
      await this.articleService.patch(params.id, body);
    } catch (error) {
      if (error instanceof CategoryNotFoundError) res.status(400).end();
      else if (error instanceof ArticleNotFoundError) res.status(404).end();
      else return Promise.reject(error);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      res.status(400).end();
      return;
    }

    const params = paramsParseResult.data;

    try {
      await this.articleService.delete(params.id);
    } catch (error) {
      if (error instanceof ArticleNotFoundError) res.status(404).end();
      else return Promise.reject(error);
    }
  }
}
