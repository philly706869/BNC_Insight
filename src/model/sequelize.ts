import { Article } from "./Article.js";
import { AuthToken } from "./AuthToken.js";
import { config } from "../config/database.config.js";
import { Sequelize } from "sequelize-typescript";
import { User } from "./User.js";

export const sequelize = new Sequelize({
  ...config,
  timezone: "+09:00",
  logging: false,
});

sequelize.addModels([User, AuthToken, Article]);

export * from "./User.js";
export * from "./AuthToken.js";
export * from "./Article.js";
