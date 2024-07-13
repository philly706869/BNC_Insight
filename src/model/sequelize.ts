import { Sequelize } from "sequelize-typescript";
import { config } from "../config/database.config.js";
import { Article } from "./Article.js";
import { AuthToken } from "./AuthToken.js";
import { Category } from "./Category.js";
import { User } from "./User.js";

export const sequelize = new Sequelize({
  ...config,
  timezone: `+09:00`,
  logging: false,
});

sequelize.addModels([User, AuthToken, Article, Category]);
