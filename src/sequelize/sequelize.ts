import { Sequelize } from "sequelize-typescript";
import { Article } from "./model/Article";
import { AuthToken } from "./model/AuthToken";
import { Category } from "./model/Category";
import { User } from "./model/User";

export const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: process.env.DB_POOL_MAX,
    min: process.env.DB_POOL_MIN,
  },
  timezone: "+09:00",
  logging: false,
});

sequelize.addModels([User, AuthToken, Article, Category]);

await sequelize.sync();
