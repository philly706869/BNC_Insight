import rawEnv from "../env.json";

type MinMax = {
  min: number;
  max: number;
};

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
    dbname: string;
    poolSize: number;
    model: {
      authToken: Record<"token", MinMax>;
      user: Record<"username" | "password" | "name", MinMax>;
      article: Record<"title" | "subtitle", MinMax>;
      category: Record<"name", MinMax>;
    };
  };
};

export const env = rawEnv satisfies Env;

export type NODE_ENV = "development" | "production";
export const NODE_ENV: NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";

export const isDev = NODE_ENV === "development";
