import { JTDParser } from "ajv/dist/jtd.js";
import fs from "fs";

export function readConfig<T>(path: string, parse: JTDParser<T>): T {
  if (!fs.existsSync(path) || !fs.lstatSync(path).isFile())
    throw new Error(`config file not found (requird file: ${path})`);

  const rawText = fs.readFileSync(path).toString("utf-8");

  const config = parse(rawText);

  if (config === undefined) {
    throw new Error(parse.message);
  }

  return config;
}
