import { config } from "@/config";
import { env } from "@/env";
import { ImageNotFoundError } from "@/errors/service-errors";
import { ImageService } from "@/services/image-service";
import { authorize } from "@/utils/authorize";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import multer, { MulterError } from "multer";
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

  private static readonly upload = multer({
    dest: path.resolve(config.image.tempPath),
    limits: { fileSize: config.image.maxBytes },
    fileFilter(req, file, callback) {
      for (const format of config.image.supportedFormats) {
        if (file.mimetype.endsWith(format)) {
          callback(null, true);
          return;
        }
      }
      callback(null, false);
    },
  }).single("image");

  public async post(req: Request, res: Response): Promise<void> {
    const userUid = authorize(req, res);
    if (userUid === undefined) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        ImageController.upload(req, res, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      if (!(error instanceof MulterError)) {
        return Promise.reject(error);
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).error({
          error: "FILE_TOO_LARGE",
          message: `File cannot bigger than ${config.image.maxBytes} bytes`,
        });
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(415).error({
          error: "UNSUPPORTED_FILE",
          message: "Unsupported file format",
        });
        return;
      }
      return Promise.reject(error);
    }

    const file = req.file!;

    const imagePath = path.resolve(file.destination, file.filename);
    try {
      const name = await this.service.post(imagePath);
      res
        .status(201)
        .json({ url: `${env.SERVER_URL}${req.originalUrl}/${name}` });
    } finally {
      await fs.rm(imagePath);
    }
  }
}
