import Express from "express";
import { apiRouter } from "./api/routers/api-router";
import { cdnRouter } from "./cdn/routers/cdn-router";
import { env } from "./env";
import { errorHandler } from "./middlewares/error-handler";
import { requestLogger } from "./middlewares/request-logger";
import { session } from "./middlewares/session";
import { NODE_ENV } from "./utils/node-env";

export const express = Express();
express.use(requestLogger);
express.use(session);
express.use("/api", apiRouter);
express.use("/cdn", cdnRouter);

if (NODE_ENV === "production") {
  express.use(
    Express.static(env.STATIC_SERVE_PATH, { index: env.INDEX_DOCUMENT_PATH })
  );
}

express.use(errorHandler);
