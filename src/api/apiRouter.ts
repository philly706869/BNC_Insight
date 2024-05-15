import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import config from "../config/server.config.js";
import expressSession from "express-session";
import signup from "./signup.js";
import login from "./login.js";
import logout from "./logout.js";
import testupload from "./testupload.js";
import multer from "multer";

export const api = express.Router();

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
api.delete("/logout", logout);

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

api.post("/testupload", upload.single("profileImage"), testupload);

export default api;
