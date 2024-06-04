import express from "express";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { config } from "../config/server.config.js";
import { signup } from "./signup.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { user } from "./user.js";

export const api = express.Router();

api.use(express.json());
api.use(cookieParser(config.cookieSecret));
api.use(
  expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 31,
    },
  })
);

declare module "express-session" {
  export interface SessionData {
    userUid: number;
  }
}

api.use("/signup", signup);
api.use("/login", login);
api.use("/logout", logout);
api.use("/user", user);
