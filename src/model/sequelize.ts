import databaseConfig from "../config/database.config.js";
import { Sequelize } from "sequelize-typescript";
import { User } from "./User.js";
import { AuthToken } from "./AuthToken.js";
import { Article } from "./Article.js";

export const sequelize = new Sequelize({
  ...databaseConfig,
  timezone: "+09:00",
  logging: false,
});

sequelize.addModels([User, AuthToken, Article]);

export default sequelize;
