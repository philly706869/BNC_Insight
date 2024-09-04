import rawEnv from "../env.json";

export type Env = {
  server: {
    port: number;
    sessionSecret: string;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    poolSize: number;
  };
};

export const env = rawEnv satisfies Env;

export type NODE_ENV = "development" | "production";
export const NODE_ENV: NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";
