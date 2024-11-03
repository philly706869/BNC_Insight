import { logger } from "@/utils/logger";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof Error) {
    if (error.stack) {
      logger.error(error.stack);
    } else {
      logger.error(`${error.name} ${error.message}`);
    }
  } else {
    logger.error(error);
  }

  res.status(500).error({
    error: "UNKNOWN_ERROR",
    message: "Unexcepted error occured",
  });
};
