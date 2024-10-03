import { CategoryService } from "@/services/category-service";
import { Request, Response } from "express";

export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  public async getMany(req: Request, res: Response): Promise<void> {}

  public async post(req: Request, res: Response): Promise<void> {}

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
