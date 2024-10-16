import { env } from "@/env";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class ImageService {
  public constructor() {}

  public async get(name: string): Promise<string | null> {
    try {
      const imagePath = path.resolve(env.image.path, name);
      const stat = await fs.stat(imagePath);
      if (!stat.isFile()) return null;
      return imagePath;
    } catch (error) {
      return null;
    }
  }

  public async post(
    imagePath: string,
    imageExt: "jpeg" | "png" | "webp"
  ): Promise<string> {
    const copyDest = path.resolve(env.image.path, `${uuidv4()}.${imageExt}`);
    await fs.copyFile(imagePath, copyDest, fs.constants.COPYFILE_EXCL);
    return copyDest;
  }
}
