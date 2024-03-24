import { Connection } from "mysql2";

export type Config = {
  port: number;
  static: {
    dir: string;
    route: string;
  };
  apiRoute: string;
  dbconnection: Connection;
  jwtsecret: string;
};

export default Config;
