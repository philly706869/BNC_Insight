import { PoolConfig, path, schema } from "./declare/pool.config.declare.js";
import getConfig from "./configProvider.js";

const object = await getConfig(path, schema);

export const config: PoolConfig = {
  connectionLimit: object.connectionLimit,
};

export default config;
