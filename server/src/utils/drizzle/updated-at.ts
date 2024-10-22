import { timestamp } from "drizzle-orm/mysql-core";
import { sqlCurrentTimestamp } from "./sql-current-timestamp";

export const updatedAt = timestamp()
  .notNull()
  .default(sqlCurrentTimestamp)
  .$onUpdate(() => sqlCurrentTimestamp);
