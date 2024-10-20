import { TypeormStore } from "connect-typeorm";
import Express, { ErrorRequestHandler } from "express";
import session from "express-session";
import { dataSource } from "./database/data-source";
import { Session } from "./database/entities/session";
import { env } from "./env";
import { NODE_ENV } from "./node-env";
import { apiRouter } from "./routers/api-router";
import { logger } from "./utils/logger";

export const express = Express();

express.use(
  session({
    secret: env.SERVER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 1000,
    },
    store: new TypeormStore().connect(dataSource.getRepository(Session)),
  })
);

express.use("/api", apiRouter);

if (NODE_ENV === "production") {
  express.use("*", (req, res) => {
    // TODO
    res.status(200).end();
  });
}

express.use(((err, req, res, next) => {
  logger.error(err);
  res.status(500).end();
}) satisfies ErrorRequestHandler);
