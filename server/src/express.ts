import Express, { ErrorRequestHandler } from "express";
import MySQLStore from "express-mysql-session";
import session from "express-session";
import { env } from "./env";
import { apiRouter } from "./routers/api-router";
import { logger } from "./utils/logger";
import { NODE_ENV } from "./utils/node-env";

export const express = Express();

express.use((req, res, next) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const httpVersion = `HTTP/${req.httpVersion}`;
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;
    const duration = Date.now() - startTime;
    const contentSize = res.getHeader("content-length");
    const ip = req.ip ?? "Unknown Ip";
    const userAgent = req.headers["user-agent"];

    logger.http(
      `[${httpVersion}] ${method} ${url} ${statusCode} in ${duration}ms with ${contentSize}bytes to ${ip} ${userAgent}`
    );
  });
  next();
});

express.use(
  session({
    secret: env.SERVER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 1000,
    },
    store: new (MySQLStore(await import("express-session")))({
      user: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      database: env.DATABASE_NAME,
      clearExpired: true,
      checkExpirationInterval: 3 * 60 * 1000,
      expiration: 30 * 24 * 60 * 1000,
    }),
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
