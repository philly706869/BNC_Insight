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
  declare id: number;

  @ManyToOne((type) => User, (user) => user.articles)
  declare uploader: User;

  @ManyToOne((type) => Category, (category) => category.articles)
  declare category: Category;

  @Column({
    type: "varchar",
    length: metadata.thumbnailUrl.max,
    nullable: true,
  })
  declare thumbnailUrl: string | null;

  @Column({ type: "varchar", length: metadata.title.max })
  declare title: string;

  @Column({ type: "varchar", length: metadata.subtitle.max })
  declare subtitle: string;

  @Column({ type: "json" })
  declare content: any;

  @Column({ type: "smallint", unsigned: true, default: 0 })
  declare views: number;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  static verifyThumbnailUrl(value: string): string | null {
    const errors: string[] = [];

    if (!validator.isURL(value, { protocols: ["http", "https"] }))
      errors.push("Thumbnail url is invalid.");

    const { max } = metadata.thumbnailUrl;
    if (value.length > max)
      errors.push(`Thumbnail url cannot be greater than ${max} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }

  private static titleRegex = /^[^\n]*$/;
  static verifyTitle(value: string): string | null {
    const errors: string[] = [];

    if (!Article.titleRegex.test(value))
      errors.push("Title cannot contain line breaks.");

    const { min, max } = metadata.title;
    if (value.length < min)
      errors.push(`Title cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Title cannot be greater than ${max} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }

  private static subtitleRegex = /^[^\n]*$/;
  static verifySubtitle(value: string): string | null {
    const errors: string[] = [];

    if (!Article.subtitleRegex.test(value))
      errors.push("Subtitle cannot contain line breaks.");

    const { min, max } = metadata.subtitle;
    if (value.length < min)
      errors.push(`Subtitle cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Subtitle cannot be greater than ${max} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }
}
