import { env } from "@/env";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import validator from "validator";
import { Category } from "./Category";
import { User } from "./User";

const metadata = env.database.model.article;

@Entity("articles")
export class Article {
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

  @Column({ type: "varchar", length: metadata.title.max })
  public declare title: string;

  @Column({ type: "varchar", length: metadata.subtitle.max })
  public declare subtitle: string;

  @Column({ type: "json" })
  public declare content: any;

  @Column({ type: "smallint", unsigned: true, default: 0 })
  public declare views: number;

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;

  public static verifyThumbnailUrl(value: string): boolean {
    if (!validator.isURL(value, { protocols: ["http", "https"] })) return false;
    const { max } = metadata.thumbnailUrl;
    if (value.length > max) return false;
    return true;
  }

  private static readonly titleRegex = /^[^\n]*$/;
  public static verifyTitle(value: string): boolean {
    if (!Article.titleRegex.test(value)) return false;
    const { min, max } = metadata.title;
    if (value.length < min) return false;
    if (value.length > max) return false;
    return true;
  }

  private static readonly subtitleRegex = /^[^\n]*$/;
  public static verifySubtitle(value: string): boolean {
    if (!Article.subtitleRegex.test(value)) return false;
    const { min, max } = metadata.subtitle;
    if (value.length < min) return false;
    if (value.length > max) return false;
    return true;
  }
}
