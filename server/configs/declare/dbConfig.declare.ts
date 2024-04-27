import { PoolOptions } from "mysql2";

export type DBConfig = PoolOptions & {
  host: string;
  database: string;
  user: string;
  password: string;
  connectionLimit: number;
};

export default DBConfig;
