import { createPool } from "mysql2";
import databaseConfig from "./config/database.config.js";
import poolConfig from "./config/pool.config.js";

export const defaultPool = createPool({ ...databaseConfig, ...poolConfig });

export default defaultPool;
