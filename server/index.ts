import { config } from "dotenv";
import path from "path";
import { exit } from "process";
import { express } from "./express";
import { dirname } from "./utils/dirname";
import { logger } from "./utils/logger";

try {
  const { NODE_ENV } = process.env;
  logger.info(`Current NODE_ENV is ${NODE_ENV}`);

  logger.info("Loading environment variables...");
  config({ path: path.join(dirname, ".env.local") });
  logger.info("Completed loading environment variables");

  logger.info("Initializing data source...");
  const { dataSource } = await import("./models/dataSource");
  await dataSource.initialize();
  logger.info("Completed initializing data source");

  logger.info("Starting express server...");
  const port = parseInt(process.env.SERVER_PORT);
  await new Promise<void>((resolve) => express.listen(port, resolve));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
