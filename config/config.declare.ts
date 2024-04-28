import { PoolOptions } from "mysql2";
import path from "path";
import { path as approot } from "../server/util/appRootPath.js";

export const configPath = path.join(approot, "internal/config.json");

export type Config = {
  port: number;
  database: PoolOptions & {
    user: string;
    password: string;
    database: string;
    host: string;
    connectionLimit: number;
  };
  logDir: string;
  cookieSecret: string;
  jwtSecret: string;
};

export default Config;
