import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

const currentTimestamp = sql`CURRENT_TIMESTAMP`;

export const createdAt = timestamp().notNull().default(currentTimestamp);

export const updatedAt = timestamp()
  .notNull()
  .default(currentTimestamp)
  .$onUpdate(() => currentTimestamp);
