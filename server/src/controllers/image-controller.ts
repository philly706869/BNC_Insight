import { ImageService } from "@/services/image-service";
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

export class ImageController {
  public constructor(private readonly service: ImageService) {}

  public async get(req: Request, res: Response): Promise<void> {}

  public async post(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file) {
      res.status(400).end();
      return;
    }
    const imagePath = path.resolve(file.destination, file.filename);
    try {
      const imageExt =
        file.mimetype === "image/jpeg"
          ? "jpeg"
          : file.mimetype === "image/png"
          ? "png"
          : file.mimetype === "image/webp"
          ? "webp"
          : null;

      if (!imageExt) {
        res.status(400).end();
        return;
      }

      await this.service.post(imagePath, imageExt);
      res.status(201).end();
    } finally {
      await fs.rm(imagePath);
    }
  }
}
