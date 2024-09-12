import rawEnv from "../env.json";

type MinMax = {
  min: number;
  max: number;
};

export type Env = {
  verification: {
    authToken: Record<"token", MinMax>;
    user: Record<"username" | "password" | "name", MinMax>;
    article: Record<"title" | "subtitle", MinMax>;
    category: Record<"name", MinMax>;
  };
};

export const env = rawEnv satisfies Env; // 이 부분에서 오류 발생 시 ../env.json 관리 필요
