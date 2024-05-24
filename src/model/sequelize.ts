import databaseConfig from "../config/database.config.js";
import { Sequelize } from "sequelize-typescript";
import { User } from "./user.js";
import { AuthToken } from "./authToken.js";
import { Article } from "./article.js";

export const sequelize = new Sequelize(databaseConfig);

sequelize.addModels([User, AuthToken, Article]);

export default sequelize;
