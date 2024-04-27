import { PoolOptions } from "mysql2";
import path from "path";
import { path as approot } from "../../util/appRootPath.js";

export const dbConfigPath = path.join(approot, "internal/dbconfig.json");

export type DBConfig = PoolOptions & {
  host: string;
  database: string;
  user: string;
  password: string;
  connectionLimit: number;
};

export default DBConfig;
