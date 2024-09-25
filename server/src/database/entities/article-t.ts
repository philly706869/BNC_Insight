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

const metadata = env.database.model.article;

@Entity("articles")
export class Article {
  private constructor() {}

  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  public declare id: number;

  @ManyToOne((type) => User, (user) => user.articles)
  public declare uploader: User;

  @ManyToOne((type) => Category, (category) => category.articles)
  public declare category: Category;

  @Column({
    type: "varchar",
    length: metadata.thumbnailUrl.max,
  })
  public declare thumbnailUrl: string;

  @Column({ type: "varchar", length: metadata.title.max })
  public declare title: string;

  @Column({ type: "varchar", length: metadata.subtitle.max })
  public declare subtitle: string;

  @Column({ type: "json" })
  public declare content: any;

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;
}
