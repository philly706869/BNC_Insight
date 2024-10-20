import { config } from "@/config";
import {
  json,
  mysqlTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";

const conf = config.article;

@Entity("articles")
export class Article {
  private constructor() {}

  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  public declare id: number;

  @ManyToOne((type) => User, (user) => user.articles)
  public declare uploader: User;

  @ManyToOne((type) => Category, (category) => category.articles, {
    nullable: true,
  })
  public declare category: Category | null;

  @Column({
    type: "varchar",
    length: conf.maxThumbnailUrlLength,
  })
  public declare thumbnailUrl: string;

  @Column({
    type: "varchar",
    length: conf.maxThumbnailCaptionLength,
  })
  public declare thumbnailCaption: string;

  @Column({ type: "varchar", length: conf.maxTitleLength })
  public declare title: string;

  @Column({ type: "varchar", length: conf.maxSubtitleLength })
  public declare subtitle: string;

  @Column({ type: "json" })
  public declare content: any;

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;
}

const ArticleTable = mysqlTable("articles", {
  id: smallint({ unsigned: true }).primaryKey().autoincrement(),
  thumbnailUrl: varchar({ length: conf.maxThumbnailUrlLength }),
  thumbnailCaption: varchar({ length: conf.maxThumbnailCaptionLength }),
  title: varchar({ length: conf.maxTitleLength }),
  subtitle: varchar({ length: conf.maxSubtitleLength }),
  content: json(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
