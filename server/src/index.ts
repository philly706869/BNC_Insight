import { exit } from "process";
import { dataSource } from "./database/models/dataSource";
import { env } from "./env";
import { express } from "./express";
import { logger } from "./utils/logger";

try {
  logger.info("Initializing data source...");
  await dataSource.initialize();
  logger.info("Completed initializing data source");

  logger.info("Starting express server...");
  const { port } = env.server;
  await new Promise<void>((resolve) => express.listen(port, resolve));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
