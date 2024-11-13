import { express } from "@express";
import { logger } from "@utils/logger";
import fs from "fs/promises";
import http from "http";
import { exit } from "process";

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
  const port: number = (() => {
    const raw = parseInt(env.SERVER_URL.port);
    if (isNaN(raw)) {
      const protocol = env.SERVER_URL.protocol;
      switch (protocol) {
        case "http:":
          return 80;
        case "https:":
          return 443;
      }
      protocol satisfies never;
    }
    return raw;
  })();
  const server = http.createServer(express);
  await new Promise<void>((resolve) => server.listen(port, () => resolve()));
  logger.info(`Completed starting express server (port: ${port})`);
} catch (error) {
  logger.error(error);
  exit(1);
}
