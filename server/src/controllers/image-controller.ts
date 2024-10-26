import { ImageNotFoundError } from "@/errors/service-errors";
import { ImageService } from "@/services/image-service";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

export class ImageController {
  public constructor(private readonly service: ImageService) {}

  private static readonly paramsSchema = z.object({
    name: z.string(),
  });

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsParseResult = await ImageController.paramsSchema.safeParseAsync(
      req.params
    );
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    try {
      const filePath = await this.service.get(params.name);
      res.status(200).sendFile(filePath);
    } catch (error) {
      if (error instanceof ImageNotFoundError) {
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }

  public async post(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (file === undefined) {
      res.status(400).end();
      return;
    }

    const imagePath = path.resolve(file.destination, file.filename);
    try {
      await this.service.post(imagePath);
      res.status(201).end();
    } finally {
      await fs.rm(imagePath);
    }
  }
}
