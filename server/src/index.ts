import { exit } from "process";
import { dataSource } from "./database/dataSource";
import { env } from "./env";
import { express } from "./express";
import { logger } from "./utils/logger";

try {
  logger.info("Connecting database...");
  await dataSource.initialize();
  logger.info("Completed connecting database");

  logger.info("Starting express server...");
  const { port } = env.server;
  await new Promise<void>((resolve) => express.listen(port, resolve));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
