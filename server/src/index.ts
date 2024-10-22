import fs from "fs/promises";
import { exit } from "process";
import { express } from "./express";
import { logger } from "./utils/logger";

try {
  const { env } = await import("@/env");
  const { config } = await import("@/config");

  logger.info("Checking directories...");
  await fs.mkdir(config.image.tempPath, { recursive: true });
  await fs.mkdir(config.image.path, { recursive: true });
  logger.info("Completed checking directories");

  logger.info("Connecting database...");
  await import("./database/database");
  logger.info("Completed connecting database");

  logger.info("Starting express server...");
  const port = env.SERVER_PORT;
  await new Promise<void>((resolve) => express.listen(port, resolve));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
