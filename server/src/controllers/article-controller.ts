import { CategoryValue } from "@/database/values/category-values";
import { ArticleService } from "@/services/article-service";
import { Request, Response } from "express";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  public async getOne(req: Request, res: Response): Promise<void> {
    const { id: rawId } = req.params;
    const id = parseInt(rawId);
    if (isNaN(id) || id < 0) {
      res.status(400).end();
      return;
    }

    const articleDTO = await this.articleService.getOne(id);
    if (articleDTO) res.status(200).json(articleDTO);
    else res.status(404).end();
  }

  public async getMany(req: Request, res: Response): Promise<void> {
    const { category: rawCategoryName, offset, limit } = req.query;
    if (
      typeof rawCategoryName !== "string" ||
      typeof offset !== "number" ||
      typeof limit !== "number"
    ) {
      res.status(400).end();
      return;
    }

    const categoryName = CategoryValue.Name.verify(rawCategoryName);
    if (!categoryName) {
      res.status(400).end();
      return;
    }

    const articlesDTO = await this.articleService.getMany(
      categoryName,
      offset,
      limit
    );
    res.status(200).json(articlesDTO);
  }

  public async post(req: Request, res: Response): Promise<void> {
    // await this.articleService.post()
  }

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
