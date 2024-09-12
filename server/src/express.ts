import { TypeormStore } from "connect-typeorm";
import Express, { ErrorRequestHandler } from "express";
import session from "express-session";
import { sessionRepository } from "./database/repositories";
import { env, isProduction } from "./env";
import { api } from "./routers/apiRouter";
import { logger } from "./utils/logger";

export const express = Express();

express.use(
  session({
    secret: env.server.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 1000,
    },
    store: new TypeormStore().connect(sessionRepository),
  })
);

express.use("/api", api);

if (isProduction) {
  express.use("*", (req, res) => {
    res.status(200).end();
  });
}

express.use(((err, req, res, next) => {
  logger.error(err);
  res.status(500).end();
}) satisfies ErrorRequestHandler);
