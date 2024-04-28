import { createPool } from "mysql2";
import config from "../config/config.js";

export const defaultPool = createPool(config.database);

export default defaultPool;
