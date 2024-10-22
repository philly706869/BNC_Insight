import { timestamp } from "drizzle-orm/mysql-core";
import { sqlCurrentTimestamp } from "./sql-current-timestamp";

export const createdAt = timestamp().notNull().default(sqlCurrentTimestamp);
