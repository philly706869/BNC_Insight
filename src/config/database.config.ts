import { join } from "path";
import configPath from "./configPath.js";
import ajv from "./ajv.js";
import getConfig from "./configReader.js";

const path = join(configPath, "database.json");

interface DatabaseConfig {
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly host: string;
}

const parse = ajv.compileParser<DatabaseConfig>({
  properties: {
    user: { type: "string" },
    password: { type: "string" },
    database: { type: "string" },
    host: { type: "string" },
  },
});

export default getConfig(path, parse);
