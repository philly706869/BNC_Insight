import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./Article";
import { AuthToken } from "./AuthToken";
import { Category } from "./Category";
import { Session } from "./Session";
import { User } from "./User";

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  poolSize: parseInt(process.env.DB_POOL_SIZE),
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: true,
  logging: false,
  timezone: "+09:00",
});
