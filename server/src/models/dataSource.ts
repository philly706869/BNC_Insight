import { env, NODE_ENV } from "@/env";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./Article";
import { AuthToken } from "./AuthToken";
import { Category } from "./Category";
import { Session } from "./Session";
import { User } from "./User";

export const dataSource = new DataSource({
  type: "mysql",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  poolSize: env.database.poolSize,
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: NODE_ENV === "development",
  logging: false,
  timezone: "+09:00",
});
