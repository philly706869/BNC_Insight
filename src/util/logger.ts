import winston, { transports } from "winston";
import winstonDRF from "winston-daily-rotate-file";
import config from "../config/server.config.js";
import path from "path";

const { combine, timestamp, label, printf, colorize } = winston.format;

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "Http Server" }),
    printf(
      ({ timestamp, label, level, message }) =>
        `[${timestamp}]-[${label}]-[${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "silly",
      format: colorize({ all: true }),
    }),
    new winstonDRF({
      level: "silly",
      datePattern: "YYYY-MM-DD",
      dirname: config.logDir,
      filename: `%DATE%.log`,
      maxFiles: 365,
      zippedArchive: true,
    }),
    new winstonDRF({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(config.logDir, "error"),
      filename: `%DATE%.error.log`,
      maxFiles: 365,
      zippedArchive: true,
    }),
  ],
});

export default logger;
