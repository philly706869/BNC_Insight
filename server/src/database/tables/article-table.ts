import { config } from "@/config";
import { createdAt, updatedAt } from "@/utils/timestamp-columns";
import { mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";
import { categoryTable } from "./category-table";
import { userTable } from "./user-table";

const conf = config.article;

export const articleTable = mysqlTable("articles", {
  uid: smallint({ unsigned: true }).primaryKey().autoincrement(),
  uploaderUid: smallint({ unsigned: true }).references(() => userTable.uid, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  categoryName: varchar({
    length: config.category.nameConstraints.max,
  }).references(() => categoryTable.name, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  thumbnailUrl: varchar({ length: conf.thumbnailUrlConstraints.max }).notNull(),
  thumbnailCaption: varchar({
    length: conf.thumbnailCaptionConstraints.max,
  }).notNull(),
  title: varchar({ length: conf.titleConstraints.max }).notNull(),
  subtitle: varchar({ length: conf.subtitleConstraints.max }).notNull(),
  content: varchar({ length: conf.contentDeltaConstraints.max }).notNull(),
  createdAt,
  updatedAt,
});
