import { CategoryNotFoundError } from "@/errors/service-errors";
import { CategoryService } from "@/services/category-service";
import { CategoryValueTransformer } from "@/tranformers/category-value-transformers";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  private static readonly paramsSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name),
  });

  public async getAll(req: Request, res: Response): Promise<void> {
    const response = await this.categoryService.getAll();
    res.status(200).json(response);
  }

  private static readonly postSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name),
  });

  public async post(req: Request, res: Response): Promise<void> {
    const bodyParseResult = await CategoryController.postSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    await this.categoryService.post(body.name);
    res.status(201).end();
  }

  private static readonly patchSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name).optional(),
  });

  public async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsParseResult =
      await CategoryController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const bodyParseResult = await CategoryController.patchSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.categoryService.patch(params.name, body);
      res.status(201).end();
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
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
    const paramsParseResult =
      await CategoryController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    try {
      await this.categoryService.delete(params.name);
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }
}
