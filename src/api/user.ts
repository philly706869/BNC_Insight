import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";
import { config } from "../config/server.config.js";

export const user = express.Router();

user.use(express.json());
user.use(cookieParser(config.cookieSecret));
user.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

user.get("/:uuid(\\d+)", (req, res) => {
  const { uuid } = req.params;

  res.json({
    uuid: uuid,
  });
});
