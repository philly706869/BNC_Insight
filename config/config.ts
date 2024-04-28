import { Config, configPath } from "./config.declare.js";
import fs from "fs";
import { exit } from "process";
import joi from "joi";

const configMetadata = fs.lstatSync(configPath);

if (!configMetadata.isFile()) {
  console.log(`config file not found (requird file: ${configPath})`);
  console.log("please execute `npm run config` to initialize configuration");
  exit();
}

const rawData = JSON.parse(fs.readFileSync(configPath).toString("utf-8"));

const schema = joi.object({
  port: joi.number().min(0).max(65535).required(),
  database: joi
    .object({
      user: joi.string().min(1).max(32).pattern(/temp/).required(),
      password: joi.string().required(),
      database: joi.string().min(1).required(),
      host: joi.string().pattern(/temp/).required(),
      connectionLimit: joi.number().min(1).required(),
    })
    .required(),
  logDir: joi.string().pattern(/temp/).required(),
  cookieSecret: joi.string().required(),
  jwtSecret: joi.string().required(),
});

const data = await schema.validateAsync(rawData);

export const config: Config = {
  port: data.port,
  database: {
    user: data.database.user,
    password: data.database.password,
    database: data.database.database,
    host: data.database.host,
    connectionLimit: data.database.connectionLimit,
  },
  logDir: data.logDir,
  cookieSecret: data.cookieSecret,
  jwtSecret: data.jwtSecret,
};

export default config;
