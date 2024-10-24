import { config } from "@/config";
import { createdAt } from "@/utils/drizzle/created-at";
import { updatedAt } from "@/utils/drizzle/updated-at";
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
  categoryName: varchar({ length: config.category.maxNameLength }).references(
    () => categoryTable.name,
    { onDelete: "set null", onUpdate: "cascade" }
  ),
  thumbnailUrl: varchar({ length: conf.maxThumbnailUrlLength }).notNull(),
  thumbnailCaption: varchar({
    length: conf.maxThumbnailCaptionLength,
  }).notNull(),
  title: varchar({ length: conf.maxTitleLength }).notNull(),
  subtitle: varchar({ length: conf.maxSubtitleLength }).notNull(),
  content: varchar({ length: conf.maxContentDeltaLength }).notNull(),
  createdAt,
  updatedAt,
});
