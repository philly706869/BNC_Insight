import express from "express";
import path from "path";
import { path as approot } from "../../util/appRootPath.js";
import cookieParser from "cookie-parser";
import config from "../../../config/config.js";
import expressSession from "express-session";
import login from "./login.js";
import logout from "./logout.js";

export const siteRouter = express.Router();

siteRouter.use(
  "/",
  express.static(path.join(approot, "/public/page"), {
    extensions: ["html", "htm"],
  })
);
siteRouter.use("/static", express.static(path.join(approot, "/public/static")));

siteRouter.use(express.urlencoded({ extended: true }));
siteRouter.use(cookieParser(config.cookieSecret));
siteRouter.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

siteRouter.post("/login", login);
siteRouter.delete("/logout", logout);

export default siteRouter;
