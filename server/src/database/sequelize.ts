import { env } from "@/env";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.database.url, {
  pool: env.database.pool,
  timezone: "+09:00",
  logging: false,
});
