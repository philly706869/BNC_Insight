import { Pool } from "mysql2";

export type Config = {
  port: number;
  static: {
    dir: string;
    route: string;
  };
  apiRoute: string;
  dbPool: Pool;
  logDir: string;
  cookieSecret: string;
  jwtSecret: string;
};

export default Config;
