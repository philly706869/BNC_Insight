import { config } from "@/config";
import { createdAt } from "@/utils/drizzle/created-at";
import { updatedAt } from "@/utils/drizzle/updated-at";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

const conf = config.category;

export const categories = mysqlTable("categories", {
  name: varchar({ length: conf.maxNameLength }).primaryKey(),
  createdAt,
  updatedAt,
});
