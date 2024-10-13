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
  username: env.database.username,
  password: env.database.password,
  host: env.database.host,
  port: env.database.port,
  database: env.database.database,
  poolSize: env.database.poolSize,
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: isDev,
  logging: false,
  timezone: "+09:00",
});
