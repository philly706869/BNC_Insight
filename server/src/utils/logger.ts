import path from "path";
import { createLogger, format, transports } from "winston";
import winstonDRF from "winston-daily-rotate-file";

const logDir = path.resolve("./logs/");

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}]-[${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      level: `silly`,
      format: format.colorize({ all: true }),
    }),
    new winstonDRF({
      level: `silly`,
      datePattern: `YYYY-MM-DD`,
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 365,
      zippedArchive: true,
    }),
    new winstonDRF({
      level: `error`,
      datePattern: `YYYY-MM-DD`,
      dirname: path.resolve(logDir, `error`),
      filename: `%DATE%.error.log`,
      maxFiles: 365,
      zippedArchive: true,
    }),
  ],
});
