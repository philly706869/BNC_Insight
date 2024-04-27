import path from "path";
import Config from "./declare/serverConfig.declare.js";
import mysql from "mysql2";
import crypto from "crypto";
import dbConfig from "./dbConfig.js";
import { path as approot } from "../util/appRootPath.js";

export const config: Config = {
  port: 3000,
  static: {
    dir: path.join(approot, "/public/static"),
    route: "/static",
  },
  apiRoute: "/api",
  dbPool: mysql.createPool(dbConfig),
  logDir: path.join(approot, "logs"),
  cookieSecret: crypto.randomBytes(64).toString("hex"),
  jwtSecret: crypto.randomBytes(64).toString("hex"),
};

export default config;
