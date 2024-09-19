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

  public static readonly ThumbnailUrl = class ThumbnailUrl {
    public static readonly max = metadata.thumbnailUrl.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): ThumbnailUrl | { error: string } {
      const { max } = ThumbnailUrl;
      const errors: string[] = [];

      if (!validator.isURL(value, { protocols: ["http", "https"] }))
        errors.push("Thumbnail url is invalid.");

      if (value.length > max)
        errors.push(`Thumbnail url cannot be greater than ${max} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new ThumbnailUrl(value);
    }
  };

  public static readonly Title = class Title {
    private static readonly regex = /^[^\n]*$/;
    public static readonly min = metadata.title.min;
    public static readonly max = metadata.title.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Title | { error: string } {
      const { regex, min, max } = Title;
      const errors: string[] = [];

      if (!regex.test(value)) errors.push("Title cannot contain line breaks.");

      if (value.length < min)
        errors.push(`Title cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Title cannot be greater than ${max} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Title(value);
    }
  };

  public static readonly Subtitle = class Subtitle {
    private static readonly regex = /^[^\n]*$/;
    public static readonly min = metadata.subtitle.min;
    public static readonly max = metadata.subtitle.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Subtitle | { error: string } {
      const { regex, min, max } = Subtitle;
      const errors: string[] = [];

      if (!regex.test(value))
        errors.push("Subtitle cannot contain line breaks.");

      if (value.length < min)
        errors.push(`Subtitle cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Subtitle cannot be greater than ${max} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Subtitle(value);
    }
  };
}
