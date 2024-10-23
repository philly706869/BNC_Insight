import { config } from "@/config";
import { ImageNotFoundError } from "@/errors/service-errors";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class ImageService {
  public constructor() {}

  /**
   * @throws {ImageNotFoundError}
   */
  public async get(name: string): Promise<string> {
    try {
      const imagePath = path.resolve(config.image.path, name);
      const stat = await fs.stat(imagePath);
      if (!stat.isFile()) {
        return Promise.reject(new ImageNotFoundError());
      }
      return imagePath;
    } catch (error) {
      return Promise.reject(new ImageNotFoundError());
    }
  }

  public async post(
    imagePath: string,
    imageExt: "jpeg" | "png" | "webp"
  ): Promise<string> {
    const copyDest = path.resolve(config.image.path, `${uuidv4()}.${imageExt}`);
    await fs.copyFile(imagePath, copyDest, fs.constants.COPYFILE_EXCL);
    return copyDest;
  }
}
