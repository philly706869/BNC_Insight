import { config } from "@/config";
import { createdAt, updatedAt } from "@/utils/timestamp-columns";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

const conf = config.category;

export const categoryTable = mysqlTable("categories", {
  name: varchar({ length: conf.maxNameLength }).primaryKey(),
  createdAt,
  updatedAt,
});
