import { CategoryValue } from "@/database/values/category-values";
import { ArticleService } from "@/services/article-service";
import { strictParseInt } from "@/utils/strict-parse-int";
import { ArticleValueTransformer } from "@/utils/zod/article-value-transformers";
import { CategoryValueTransformer } from "@/utils/zod/category-value-transformers";
import { Request, Response } from "express";
import { z } from "zod";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  public async getOne(req: Request, res: Response): Promise<void> {
    const id = strictParseInt(req.params.id);
    if (isNaN(id) || id < 0) {
      res.status(400).end();
      return;
    }

    const articleDTO = await this.articleService.getOne(id);
    if (articleDTO) res.status(200).json(articleDTO);
    else res.status(404).end();
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
    const queryParsedResult =
      await ArticleController.getManyQuerySchema.safeParseAsync(req.query);

    if (!queryParsedResult.success) {
      res.status(400).end();
      return;
    }

    const { category, offset, limit } = queryParsedResult.data;

    const articlesDTO = await this.articleService.getMany(
      category,
      offset,
      limit
    );
    res.status(200).json(articlesDTO);
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

    const bodyParsedResult =
      await ArticleController.postBodySchema.safeParseAsync(req.body);
    if (!bodyParsedResult.success) {
      res.status(400).end();
      return;
    }

    const body = bodyParsedResult.data;

    await this.articleService.post(
      uploaderUid,
      body.category,
      body.thumbnail,
      body.title,
      body.subtitle,
      body.content
    );
  }

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
