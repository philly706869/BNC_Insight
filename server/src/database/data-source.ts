import { env } from "@/env";
import { NODE_ENV } from "@/node-env";
import { drizzle } from "drizzle-orm/mysql2";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./entities/article";
import { AuthToken } from "./entities/auth-token";
import { Category } from "./entities/category";
import { Session } from "./entities/session";
import { User } from "./entities/user";

export const dataSource = new DataSource({
  type: "mysql",
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  poolSize: env.DATABASE_CONNECTION_LIMIT,
  entities: [Article, AuthToken, Category, User, Session],
  synchronize: NODE_ENV === "development",
  logging: false,
  timezone: "+09:00",
});

const database = drizzle({
  connection: {
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,
    connectionLimit: env.DATABASE_CONNECTION_LIMIT,
  },
});
