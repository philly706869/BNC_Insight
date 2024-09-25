import { env, isDev } from "@/env";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./entities/article";
import { AuthToken } from "./entities/auth-token";
import { Category } from "./entities/category";
import { Session } from "./entities/session";
import { User } from "./entities/user";

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
