import { config } from "@/config";
import { createdAt } from "@/utils/drizzle/created-at";
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const conf = config.authToken;

export const authTokenTable = mysqlTable("auth_tokens", {
  token: varchar({ length: conf.maxTokenLength }).primaryKey(),
  isAdminToken: boolean().notNull().default(false),
  createdAt,
});
