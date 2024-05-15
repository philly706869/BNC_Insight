import {
  DatabaseConfig,
  path,
  schema,
} from "./declare/database.config.declare.js";
import getConfig from "./configProvider.js";

const object = await getConfig(path, schema);

export const config: DatabaseConfig = {
  user: object.user,
  password: object.password,
  database: object.database,
  host: object.host,
};

export default config;
