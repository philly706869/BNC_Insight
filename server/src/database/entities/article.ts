import { env } from "@/env";
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

const metadata = env.article;

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
    nullable: true,
  })
  public declare thumbnailUrl: string | null;

  @Column({
    type: "varchar",
    length: metadata.thumbnailCaption.max,
    nullable: true,
  })
  public declare thumbnailCaption: string | null;

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
