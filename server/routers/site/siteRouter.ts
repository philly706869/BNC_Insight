import express, { Request, Response } from "express";
import path from "path";
import { path as approot } from "../../util/appRootPath.js";

export const siteRouter = express.Router();

const fileSenderGenerator =
  (relativePath: string) => (req: Request, res: Response) => {
    res.sendFile(path.join(approot, relativePath));
  };

siteRouter.get("/", fileSenderGenerator("./public/html/home.html"));
siteRouter.get("/login", fileSenderGenerator("./public/html/login.html"));
siteRouter.get("/signin", fileSenderGenerator("./public/html/signin.html"));

export default siteRouter;
