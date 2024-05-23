import { join } from "path";
import configPath from "./configPath.js";
import ajv from "./ajv.js";
import getConfig from "./configReader.js";

const path = join(configPath, "email.json");

interface EmailConfig {
  readonly service: string;
  readonly auth: {
    readonly user: string;
    readonly pass: string;
  };
}

const parse = ajv.compileParser<EmailConfig>({
  properties: {
    service: { type: "string" },
    auth: {
      properties: {
        user: { type: "string" },
        pass: { type: "string" },
      },
    },
  },
});

export default getConfig(path, parse);
