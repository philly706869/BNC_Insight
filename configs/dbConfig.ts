import fs from "fs";
import DBConfig, { dbConfigPath } from "./declare/dbConfig.declare.js";

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
