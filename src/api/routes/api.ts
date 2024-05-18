import express from "express";
import cookieParser from "cookie-parser";
import config from "../../config/server.config.js";
import expressSession from "express-session";
import signup from "./signup.js";
import login from "./login.js";
import logout from "./logout.js";
import validation from "./validation.js";
import user from "../util/user.js";

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

api.post("/signup", signup);
api.post("/login", login);
api.post("/logout", logout);
api.get("/validation", validation);
api.use("/user", user);

export default api;
