import { TypeormStore } from "connect-typeorm";
import Express, { ErrorRequestHandler } from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import { dataSource } from "./database/data-source";
import { Session } from "./database/entities/session";
import { env, isProduction } from "./env";
import { api } from "./routers/api-router";
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
    store: new TypeormStore().connect(dataSource.getRepository(Session)),
  })
);

express.use("/api", api);

const uploader = multer({
  dest: path.resolve(env.thumbnail.path),
  limits: { fileSize: env.thumbnail.maxBytes },
  fileFilter(req, file, callback) {
    if (env.thumbnail.supportedMIMETypes.includes(file.mimetype))
      callback(null, true);
    else callback(null, false);
  },
});

express.post("/test", uploader.single("file"), (req, res) => {
  res.status(200).end();
});

if (isProduction) {
  express.use("*", (req, res) => {
    // TODO
    res.status(200).end();
  });
}

express.use(((err, req, res, next) => {
  logger.error(err);
  res.status(500).end();
}) satisfies ErrorRequestHandler);
