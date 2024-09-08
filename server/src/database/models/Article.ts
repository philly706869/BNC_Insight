import { env } from "@/env";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

const { title: titleMeta, subtitle: subtitleMeta } = env.database.model.article;

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare id: number;

  @ManyToOne((type) => User, (user) => user.articles)
  declare uploader: User;

  @ManyToOne((type) => Category, (category) => category.articles)
  declare category: Category;

  @Column({ type: "varchar", length: titleMeta.max })
  declare title: string;

  @Column({ type: "varchar", length: subtitleMeta.max })
  declare subtitle: string;

  @Column({ type: "json" })
  declare content: any;

  @Column({ type: "smallint", unsigned: true, default: 0 })
  declare views: number;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
