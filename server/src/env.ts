import rawEnv from "../env.json";

type Min = {
  readonly min: number;
};

type Max = {
  readonly max: number;
};

type MinMax = Min & Max;

export type Env = {
  readonly server: {
    readonly url: string;
    readonly port: number;
    readonly sessionSecret: string;
  };
  readonly database: {
    readonly username: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;
    readonly poolSize: number;
  };
  readonly authToken: {
    readonly token: MinMax;
  };
  readonly user: {
    readonly username: MinMax;
    readonly password: MinMax;
    readonly name: MinMax;
  };
  readonly article: {
    readonly thumbnailUrl: Max;
    readonly thumbnailCaption: MinMax;
    readonly title: MinMax;
    readonly subtitle: MinMax;
  };
  readonly category: {
    readonly name: MinMax;
  };
  readonly thumbnail: {
    readonly path: string;
    readonly maxBytes: number;
    readonly supportedMIMETypes: string[];
  };
};

export const env: Env = rawEnv; // 이 부분에서 오류 발생 시 ../env.json 관리 필요

export type NODE_ENV = "development" | "production";
export const NODE_ENV: NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";

export const isDev = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
