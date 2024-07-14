import fs from "fs/promises";
import path from "path";
import { configPath } from "./configPath.js";

interface ServerConfig {
  readonly port: number;
  readonly logDir: string;
  readonly cookieSecret: string;
  readonly sessionSecret: string;
}

export const config: ServerConfig = JSON.parse(
  (await fs.readFile(path.join(configPath, `server.json`))).toString(`utf-8`)
);
