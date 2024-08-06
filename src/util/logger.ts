import path from "path";
import winston, { transports } from "winston";
import winstonDRF from "winston-daily-rotate-file";
import { __dirname } from "./__dirname";

const { combine, timestamp, printf, colorize } = winston.format;

const logDir = path.join(__dirname, "logs");

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
    printf(
      ({ timestamp, level, message }) => `[${timestamp}]-[${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      level: `silly`,
      format: colorize({ all: true }),
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
      dirname: path.join(logDir, `error`),
      filename: `%DATE%.error.log`,
      maxFiles: 365,
      zippedArchive: true,
    }),
  ],
});
