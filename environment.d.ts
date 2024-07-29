namespace NodeJS {
  interface ProcessEnv {
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_DIALECT: import("sequelize").Dialect;
    DB_POOL_MAX: number;
    DB_POOL_MIN: number;
  }
}
