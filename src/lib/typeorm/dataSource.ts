import "reflect-metadata";
import { DataSource } from "typeorm";
import { logger } from "../logger";
import { singleton } from "../singleton";
import { Article } from "./model/Article";
import { AuthToken } from "./model/AuthToken";
import { Category } from "./model/Category";
import { User } from "./model/User";

export const dataSource = await singleton("dataSource", async () => {
  const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    poolSize: parseInt(process.env.DB_POOL_SIZE),
    entities: [Article, AuthToken, Category, User],
    synchronize: true,
    logging: false,
    timezone: "+09:00",
  });

  logger.info("Initializing data source...");
  await dataSource.initialize();
  logger.info("Completed initializing data source");
});
