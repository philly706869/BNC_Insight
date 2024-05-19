import { join } from "path";
import configPath from "./config.path.js";
import joi from "joi";

export const path = join(configPath, "server.json");

export const schema = joi.object({
  port: joi.number().required(),
  logDir: joi.string().required(),
  cookieSecret: joi.string().required(),
  sessionSecret: joi.string().required(),
});

export type ServerConfig = Readonly<{
  readonly port: number;
  readonly logDir: string;
  readonly cookieSecret: string;
  readonly sessionSecret: string;
}>;

export default ServerConfig;
