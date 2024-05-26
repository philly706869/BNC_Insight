import { join } from "path";
import { configPath } from "./configPath.js";
import { ajv } from "./ajv.js";
import { readConfig } from "./configReader.js";

const path = join(configPath, "server.json");

interface ServerConfig {
  readonly port: number;
  readonly logDir: string;
  readonly cookieSecret: string;
  readonly sessionSecret: string;
}

const parse = ajv.compileParser<ServerConfig>({
  properties: {
    port: { type: "uint32" },
    logDir: { type: "string" },
    cookieSecret: { type: "string" },
    sessionSecret: { type: "string" },
  },
});

export const config = readConfig(path, parse);
