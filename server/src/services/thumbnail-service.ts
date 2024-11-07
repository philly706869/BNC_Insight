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

  /**
   * @throws {ImageNotFoundError}
   */
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

  /**
   * @throws {UnsupportedImageFormatError}
   */
  public async post(imagePath: string): Promise<string> {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const format = metadata.format;
      const supportedFormats = config.thumbnail.supportedFormats;
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
      const name = `${uuidv4()}.${format}`;
      const dest = path.resolve(config.image.path, name);
      await image.toFile(dest);
      return name;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
