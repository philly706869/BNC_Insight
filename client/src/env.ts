import rawEnv from "../env.json";

type MinMax = {
  min: number;
  max: number;
};

export type Env = {
  verification: {
    authToken: Record<"token", MinMax>;
    user: Record<"id" | "password" | "name", MinMax>;
    article: Record<"title" | "subtitle", MinMax>;
    category: Record<"name", MinMax>;
  };
};

export const env = rawEnv satisfies Env;
