import { env, isDev } from "@/env";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./entities/Article";
import { AuthToken } from "./entities/AuthToken";
import { Category } from "./entities/Category";
import { Session } from "./entities/Session";
import { User } from "./entities/User";

export const dataSource = new DataSource({
  type: "mysql",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.dbname,
  poolSize: env.database.poolSize,
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: isDev,
  logging: false,
  timezone: "+09:00",
});
