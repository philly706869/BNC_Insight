import { config } from "@/config";
import { BCRYPT_HASH_LENGTH } from "@/utils/constants";
import { createdAt, updatedAt } from "@/utils/timestamp-columns";
import {
  binary,
  boolean,
  mysqlTable,
  smallint,
  varchar,
} from "drizzle-orm/mysql-core";

const conf = config.user;

export const userTable = mysqlTable("users", {
  uid: smallint({ unsigned: true }).primaryKey().autoincrement(),
  username: varchar({ length: conf.maxUsernameLength }).unique().notNull(),
  passwordHash: binary({ length: BCRYPT_HASH_LENGTH })
    .$type<Buffer>()
    .notNull(),
  name: varchar({ length: conf.maxNameLength }).notNull(),
  isAdmin: boolean().default(false).notNull(),
  createdAt,
  updatedAt,
});
