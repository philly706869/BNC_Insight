import { ArticleService } from "@/services/article-service";
import { Request, Response } from "express";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  public async getOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
  }

  public async getMany(req: Request, res: Response): Promise<void> {
    const { category, offset, limit } = req.query;
    if (
      typeof category !== "string" ||
      typeof offset !== "string" ||
      typeof limit !== "string"
    ) {
      res.status(400).end();
      return;
    }
  }

  public async post(req: Request, res: Response): Promise<void> {}

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
