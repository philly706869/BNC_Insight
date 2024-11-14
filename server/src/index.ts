import { config } from "@config";
import { logger } from "@utils/logger";
import fs from "fs/promises";
import http from "http";
import { exit } from "process";

try {
  const { env } = await import("@env");

  logger.info("Checking directories...");
  const requiredPaths = [
    config.image.tempPath,
    config.image.uploadPath,
    config.thumbnail.tempPath,
    config.thumbnail.uploadPath,
  ];
  for (const requiredPath of requiredPaths) {
    await fs.mkdir(requiredPath, { recursive: true });
  }
  logger.info("Completed checking directories");

  logger.info("Connecting database...");
  await import("@database/database");
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
  const { express } = await import("@express");
  const server = http.createServer(express);
  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      return resolve();
    });
  });
  logger.info(
    `Completed starting express server (origin: \`${env.SERVER_URL.origin}\`)`
  );
} catch (error) {
  logger.error(error);
  exit(1);
}
