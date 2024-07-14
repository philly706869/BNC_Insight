import fs from "fs/promises";
import path from "path";
import { Dialect } from "sequelize";
import { configPath } from "./configPath.js";

interface DatabaseConfig {
  readonly username: string;
  readonly password: string;
  readonly database: string;
  readonly host: string;
  readonly dialect: Dialect;
  readonly pool: {
    readonly max: number;
    readonly min: number;
  };
}

export const config: DatabaseConfig = JSON.parse(
  (await fs.readFile(path.join(configPath, `database.json`))).toString(`utf-8`)
);
