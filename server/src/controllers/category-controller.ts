import {
  CategoryNotFoundError,
  PermissionDeniedError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { CategoryService } from "@/services/category-service";
import { CategoryValueTransformer } from "@/tranformers/category-value-transformers";
import { authorize } from "@/utils/authorize";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  private static readonly paramsSchema = z.object({
    name: z.string(),
  });

  public async getAll(req: Request, res: Response): Promise<void> {
    const response = await this.categoryService.getAll();
    res.status(200).json(response);
  }

  private static readonly postSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name),
  });

  public async post(req: Request, res: Response): Promise<void> {
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

    const bodyParseResult = await CategoryController.postSchema.safeParseAsync(
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

    try {
      await this.categoryService.post(userUid, body.name);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(401).end();
      } else if (error instanceof PermissionDeniedError) {
        res.status(403).end();
      } else {
        return Promise.reject(error);
      }
    }
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
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

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
      await this.categoryService.patch(userUid, params.name, body);
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(401).end();
      } else if (error instanceof PermissionDeniedError) {
        res.status(403).end();
      } else if (error instanceof CategoryNotFoundError) {
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
      await CategoryController.paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    try {
      await this.categoryService.delete(userUid, params.name);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(401).end();
      } else if (error instanceof PermissionDeniedError) {
        res.status(403).end();
      } else if (error instanceof CategoryNotFoundError) {
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }
}
