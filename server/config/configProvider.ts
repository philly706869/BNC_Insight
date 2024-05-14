import fs from "fs";
import { AnySchema } from "joi";

export const getConfig = async (path: string, schema: AnySchema) => {
  const metadata = fs.lstatSync(path);

  if (!metadata.isFile())
    throw new Error(`config file not found (requird file: ${path})`);

  const rawText = fs.readFileSync(path).toString("utf-8");
  const rawJson = JSON.parse(rawText);

  const config = await schema.validateAsync(rawJson);

  return config;
};

export default getConfig;
