import { TypeormStore } from "connect-typeorm";
import { config } from "dotenv";
import Express from "express";
import session from "express-session";
import Next from "next";
import path from "path";
import { exit } from "process";
import { api } from "./api/api";
import { Session } from "./api/database/models/Session";
import { dirname } from "./utils/dirname";
import { logger } from "./utils/logger";

try {
  const { NODE_ENV } = process.env;
  logger.info(`Current NODE_ENV is ${NODE_ENV}`);

  logger.info("Loading environment variables...");
  config({ path: path.join(dirname, ".env.local") });
  logger.info("Completed loading environment variables");

  logger.info("Initializing data source...");
  const { dataSource } = await import("./api/database/dataSource");
  await dataSource.initialize();
  logger.info("Completed initializing data source");

  logger.info("Preparing next app...");
  const next = Next({
    dev: NODE_ENV === "development",
    dir: path.join(dirname, "src/next"),
  });
  await next.prepare();
  logger.info("Completed preparing next app");

  logger.info("Starting express server...");
  const express = Express();
  express.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 1000,
      },
      store: new TypeormStore().connect(dataSource.getRepository(Session)),
    })
  );
  express.use("/api", api);
  const nextHandler = next.getRequestHandler();
  express.use((req, res) => nextHandler(req, res));
  const port = parseInt(process.env.SERVER_PORT);
  await new Promise<void>((resolve) => express.listen(port, resolve));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
