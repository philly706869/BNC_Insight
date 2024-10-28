import Express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { requestLogger } from "./middlewares/request-logger";
import { session } from "./middlewares/session";
import { apiRouter } from "./routers/api-router";
import { NODE_ENV } from "./utils/node-env";

export const express = Express();
express.response.error = express.response.json;
express.use(requestLogger);
express.use(session);
express.use("/api", apiRouter);

if (NODE_ENV === "production") {
  express.use("*", (req, res) => {
    // TODO
    res.status(200).end();
  });
}

express.use(errorHandler);
