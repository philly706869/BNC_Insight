import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
import { z } from "zod";

const configPath = path.resolve("./config.yaml");

const configSchema = z
  .object({
    authToken: z
      .object({
        maxTokenLength: z.number(),
      })
      .readonly(),
    user: z
      .object({
        maxUsernameLength: z.number(),
        minPasswordLength: z.number(),
        maxPasswordLength: z.number(),
        maxNameLength: z.number(),
      })
      .readonly(),
    category: z
      .object({
        maxNameLength: z.number(),
      })
      .readonly(),
    article: z
      .object({
        defaultQueryLimit: z.number(),
        maxQueryLimit: z.number(),
        defaultThumbnailUrl: z.string(),
        maxThumbnailUrlLength: z.number(),
        maxThumbnailCaptionLength: z.number(),
        maxTitleLength: z.number(),
        maxSubtitleLength: z.number(),
        maxContentDeltaLength: z.number(),
      })
      .readonly(),
    image: z
      .object({
        tempPath: z.string(),
        path: z.string(),
        maxBytes: z.number(),
      })
      .readonly(),
  })
  .readonly();

export const config = await (async () => {
  try {
    const rawConfig = await fs.readFile(configPath, "utf8");
    try {
      const parsedConfig = yaml.parse(rawConfig);
      try {
        return await configSchema.parseAsync(parsedConfig);
      } catch {
        return Promise.reject(new Error("Config format is not valid"));
      }
    } catch {
      return Promise.reject(new Error("Failed to parse config"));
    }
  } catch {
    return Promise.reject(new Error(`Failed to read config \`${configPath}\``));
  }
})();
