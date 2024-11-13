import { config } from "@config";
import { env } from "@env";
import {
  FileTooLargeError,
  UnsupportedFileError,
} from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { ImageService } from "@services/cdn/image-service";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
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
    const paramsSchema = ImageController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const filePath = await this.service.get(params.name);
    res.status(StatusCodes.OK).sendFile(filePath);
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

  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        ImageController.upload(req, res, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    } catch (error) {
      if (!(error instanceof MulterError)) {
        return Promise.reject(error);
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          new FileTooLargeError(
            `File cannot bigger than ${config.image.maxBytes} bytes`
          )
        );
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        next(new UnsupportedFileError());
        return;
      }
      return Promise.reject(error);
    }

    const file = req.file!;

    const imagePath = path.resolve(file.destination, file.filename);
    try {
      const name = await this.service.post(imagePath);
      const url = `${env.SERVER_URL.origin}${req.originalUrl}/${name}`;
      res.status(StatusCodes.CREATED).json({ url });
    } finally {
      await fs.rm(imagePath);
    }
  }
}
