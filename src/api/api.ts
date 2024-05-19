import express from "express";
import cookieParser from "cookie-parser";
import config from "../config/server.config.js";
import expressSession from "express-session";
import signup from "./signup/signup.js";
import login from "./login.js";
import logout from "./logout.js";
import user from "./user.js";

const api = express.Router();

api.use(express.json());
api.use(cookieParser(config.cookieSecret));
api.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

api.use("/signup", signup);
api.post("/login", login);
api.post("/logout", logout);
api.use("/user", user);

export default api;
