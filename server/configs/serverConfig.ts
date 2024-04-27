import path from "path";
import Config from "./declare/serverConfig.declare";
import mysql from "mysql2";
import fs from "fs";
import crypto from "crypto";
import { path as approot } from "app-root-path";
import dbConfig from "./dbConfig";

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
