import { config } from "@/config";
import {
  ImageNotFoundError,
  InvalidImageSizeError,
  UnsupportedImageFormatError,
} from "@/errors/service-errors";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export class ThumbnailService {
  public constructor() {}

  public async get(name: string): Promise<string> {
    try {
      const imagePath = path.resolve(config.thumbnail.path, name);
      const stat = await fs.stat(imagePath);
      if (!stat.isFile()) {
        return Promise.reject(new ImageNotFoundError());
      }
      return imagePath;
    } catch (error) {
      return Promise.reject(new ImageNotFoundError());
    }
  }

  public async post(imagePath: string): Promise<string> {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const format = metadata.format;
    const conf = config.image;
    const supportedFormats = config.image.supportedFormats;
    if (
      format === undefined ||
      !(supportedFormats as string[]).includes(format)
    ) {
      return Promise.reject(new UnsupportedImageFormatError());
    }
    const width = config.thumbnail.width;
    const height = config.thumbnail.height;
    if (metadata.width !== width || metadata.height !== height) {
      return Promise.reject(new InvalidImageSizeError());
    }
    const saveFormat = conf.saveFormat;
    const name = `${uuidv4()}.${saveFormat}`;
    const dest = path.resolve(config.image.path, name);
    await image.toFormat(saveFormat).toFile(dest);
    return name;
  }
}