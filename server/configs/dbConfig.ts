import { PoolOptions } from "mysql2";
import path from "path";
import { path as approot } from "app-root-path";
import fs from "fs";
import DBConfig from "./declare/dbConfig.declare";

const dbConfigPath = path.join(approot, "internal/dbconfig.json");

const dbConfigMetadata = fs.lstatSync(dbConfigPath);

if (!dbConfigMetadata.isFile())
  throw Error(`database config not found (requird file: ${dbConfigPath})`);

const rawData = JSON.parse(fs.readFileSync(dbConfigPath).toString("utf-8"));

const getProp = (prop: string) => {
  const data = rawData[prop];
  if (!data) throw Error(`${prop} required in ${dbConfigPath}`);
  return data;
};

export const dbConfig: DBConfig = {
  host: getProp("host"),
  database: getProp("database"),
  user: getProp("user"),
  password: getProp("password"),
  connectionLimit: getProp("connectionLimit"),
};

export default dbConfig;
