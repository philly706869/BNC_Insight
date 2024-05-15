import { join } from "path";
import configPath from "./config.path.js";
import joi from "joi";
import { PoolOptions } from "mysql2";

export const path = join(configPath, "pool.json");

export const schema = joi.object({
  connectionLimit: joi.number().required(),
});

export type PoolConfig = PoolOptions & {
  connectionLimit: number;
};

export default PoolConfig;
