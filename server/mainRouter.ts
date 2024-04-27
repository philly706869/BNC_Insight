import express from "express";
import path from "path";
import { path as approot } from "app-root-path";

export const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.sendFile(path.join(approot, "./public/home.html"));
});

export default mainRouter;
