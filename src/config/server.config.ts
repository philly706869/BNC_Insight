import { ServerConfig, path, schema } from "./declare/server.config.declare.js";
import getConfig from "./configProvider.js";

const object = await getConfig(path, schema);

export const config: ServerConfig = {
  port: object.port,
  logDir: object.logDir,
  cookieSecret: object.cookieSecret,
  sessionSecret: object.sessionSecret,
};

export default config;
