import { env, NODE_ENV } from "@/env";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./models/Article";
import { AuthToken } from "./models/AuthToken";
import { Category } from "./models/Category";
import { Session } from "./models/Session";
import { User } from "./models/User";

export const dataSource = new DataSource({
  type: "mysql",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.dbname,
  poolSize: env.database.poolSize,
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: NODE_ENV === "development",
  logging: false,
  timezone: "+09:00",
});
