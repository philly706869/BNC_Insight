import express from "express";
import path from "path";
import { path as approot } from "../../util/appRootPath.js";
import cookieParser from "cookie-parser";
import config from "../../config/server.config.js";
import expressSession from "express-session";
import signup from "./signup.js";
import login from "./login.js";
import logout from "./logout.js";
import testupload from "./testupload.js";
import multer from "multer";

export const siteRouter = express.Router();

siteRouter.use(
  "/",
  express.static(path.join(approot, "/public/page"), {
    extensions: ["html", "htm"],
  })
);

siteRouter.use(express.json());
siteRouter.use(cookieParser(config.cookieSecret));
siteRouter.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

siteRouter.post("/signup", signup);
siteRouter.post("/login", login);
siteRouter.delete("/logout", logout);

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      done(null, file.originalname);
    },
    destination(req, file, done) {
      done(null, path.join(__dirname, "public"));
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
  },
});

siteRouter.post("/testupload", upload.single("profileImage"), testupload);

export default siteRouter;
