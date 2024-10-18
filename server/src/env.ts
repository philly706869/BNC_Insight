import rawEnv from "../env.json"; // 오류 발생 시 ../env.json 추가할 것

export type Env = {
  readonly server: {
    readonly url: string;
    readonly port: number;
    readonly sessionSecret: string;
    readonly uploadTempPath: string;
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
    readonly maxTokenLength: number;
  };
  readonly user: {
    readonly maxUsernameLength: number;
    readonly minPasswordLength: number;
    readonly maxPasswordLength: number;
    readonly maxNameLength: number;
  };
  readonly category: {
    readonly maxNameLength: number;
  };
  readonly article: {
    readonly defaultQueryLimit: number;
    readonly maxQueryLimit: number;
    readonly maxThumbnailUrlLength: number;
    readonly maxThumbnailCaptionLength: number;
    readonly maxTitleLength: number;
    readonly maxSubtitleLength: number;
    readonly maxContentDeltaLength: number;
  };
  readonly thumbnail: {
    readonly defaultUrl: string;
    readonly path: string;
    readonly maxBytes: number;
  };
  readonly image: {
    readonly path: string;
    readonly maxBytes: number;
  };
};

export const env: Env = rawEnv; // ../env.json의 구조가 유효하지 않을 시 오류 발생

export type NODE_ENV = "development" | "production";
export const NODE_ENV: NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";

export const isDev = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
