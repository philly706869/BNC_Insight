import {
  ArticleNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { ArticleService } from "@/services/article-service";
import { ArticleValueTransformer } from "@/tranformers/article-value-transformers";
import { CategoryValueTransformer } from "@/tranformers/category-value-transformers";
import { authorize } from "@/utils/authorize";
import { extractIssue } from "@/utils/extract-issue";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  private static readonly paramsSchema = z.object({
    id: z.coerce.number().int().nonnegative(),
  });

  public async getOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    try {
      const response = await this.articleService.getOne(params.id);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ArticleNotFoundError) {
        res.status(404).error({
          error: "ARTICLE_NOT_FOUND",
          message: error.message,
        });
      } else {
        return Promise.reject(error);
      }
    }
  }

  private static readonly getManySchema = z.object({
    category: z
      .string()
      .transform(CategoryValueTransformer.name)
      .or(z.literal("").transform(() => null))
      .optional(),
    offset: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().optional(),
  });

  public async getMany(req: Request, res: Response): Promise<void> {
    const queryParseResult =
      await ArticleController.getManySchema.safeParseAsync(req.query);
    if (!queryParseResult.success) {
      res.status(400).error({
        error: "INVALID_QUERY",
        message: "Query is not valid",
        details: extractIssue(queryParseResult.error),
      });
      return;
    }
    const query = queryParseResult.data;

    try {
      const response = await this.articleService.getMany(
        query.category,
        query.offset,
        query.limit
      );
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof QueryOffsetOutOfBoundsError) {
        res.status(400).error({
          error: "QUERY_OFFSET_OUT_OF_BOUNDS",
          message: error.message,
        });
      } else if (error instanceof QueryLimitOutOfBoundsError) {
        res.status(400).error({
          error: "QUERY_LIMIT_OUT_OF_BOUNDS",
          message: error.message,
        });
      } else {
        return Promise.reject(error);
      }
    }
  }

  private static readonly postSchema = z.object({
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
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

    const bodyParseResult = await ArticleController.postSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).error({
        error: "INVALID_DATA",
        message: "Provided data does not valid",
        details: bodyParseResult.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }
    const body = bodyParseResult.data;

    const response = await this.articleService.post(
      userUid,
      body.category,
      body.thumbnail,
      body.title,
      body.subtitle,
      body.content
    );
    res.status(201).json(response);
  }

  private static readonly patchSchema = z.object({
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

  public async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const bodyParseResult = await ArticleController.patchSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.articleService.patch(userUid, params.id, body);
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(400).end();
      } else if (error instanceof ArticleNotFoundError) {
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

    const paramsParseResult =
      await ArticleController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    try {
      await this.articleService.delete(userUid, params.id);
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(400).end();
      } else if (error instanceof ArticleNotFoundError) {
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }
}
