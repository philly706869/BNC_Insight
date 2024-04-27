import winston from "winston";
import winston_drf from "winston-daily-rotate-file";
import config from "../configs/serverConfig.js";
import path from "path";

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}]-[${label}]-[${level}]: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "Local Server" }),
    logFormat
  ),
  transports: [
    new winston_drf({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: config.logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winston_drf({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(config.logDir, "error"),
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});
