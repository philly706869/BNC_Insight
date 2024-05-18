import { PoolConfig, path, schema } from "./declare/pool.config.declare.js";
import getConfig from "./configReader.js";

const object = await getConfig(path, schema);

export const config: PoolConfig = Object.freeze({
  connectionLimit: object.connectionLimit,
});

export default config;
