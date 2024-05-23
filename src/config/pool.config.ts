import { join } from "path";
import configPath from "./configPath.js";
import ajv from "./ajv.js";
import getConfig from "./configReader.js";

const path = join(configPath, "pool.json");

interface PoolConfig {
  readonly connectionLimit: number;
}

const parse = ajv.compileParser<PoolConfig>({
  properties: {
    connectionLimit: { type: "uint32" },
  },
});

export default getConfig(path, parse);
