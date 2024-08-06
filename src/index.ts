import { config } from "dotenv";
import Express from "express";
import Next from "next";
import path from "path";
import { exit } from "process";
import { router as apiRouter } from "./api/route";
import { __dirname } from "./util/__dirname";
import { logger } from "./util/logger";

try {
  logger.info("Loading environment variables...");
  config({ path: path.join(__dirname, ".env.local") });
  const { NODE_ENV, SERVER_PORT } = process.env;
  logger.info(
    `Completed loading environment variables (current NODE_ENV: ${NODE_ENV})`
  );

  logger.info("Preparing next app...");
  const dev = NODE_ENV === "development";
  const next = Next({ dev, dir: "src/next" });
  await next.prepare();
  logger.info("Completed preparing next app");

  logger.info("Initializing data source...");
  const { dataSource } = await import("./typeorm/dataSource");
  await dataSource.initialize();
  logger.info("Completed initializing data source");

  logger.info("Starting express server...");
  const express = Express();
  express.use(apiRouter);
  const handler = next.getRequestHandler();
  express.use((req, res) => handler(req, res));
  express.listen(parseInt(SERVER_PORT), () => {
    logger.info(
      `Completed starting express server (current SERVER_PORT: ${SERVER_PORT})`
    );
  });
} catch (error) {
  logger.error(error);
  exit(1);
}
