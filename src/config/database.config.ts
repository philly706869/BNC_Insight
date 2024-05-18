import {
  DatabaseConfig,
  path,
  schema,
} from "./declare/database.config.declare.js";
import getConfig from "./configReader.js";

const object = await getConfig(path, schema);

export const config: DatabaseConfig = Object.freeze({
  user: object.user,
  password: object.password,
  database: object.database,
  host: object.host,
});

export default config;
