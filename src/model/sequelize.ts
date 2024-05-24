import databaseConfig from "../config/database.config.js";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(databaseConfig);

export default sequelize;
