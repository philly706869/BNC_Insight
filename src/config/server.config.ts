import { ServerConfig, path, schema } from "./declare/server.config.declare.js";
import getConfig from "./configReader.js";

const object = await getConfig(path, schema);

export const config: ServerConfig = Object.freeze({
  port: object.port,
  logDir: object.logDir,
  cookieSecret: object.cookieSecret,
  sessionSecret: object.sessionSecret,
});

export default config;
