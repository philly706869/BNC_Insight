import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity("articles")
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  @ManyToOne((type) => User, (user) => user.articles)
  declare uploader: User;

  @ManyToOne((type) => Category, (category) => category.articles)
  declare category: Category;

  static readonly TITLE_MIN_LENGTH = 1;
  static readonly TITLE_MAX_LENGTH = 64;

  @Column({ type: "varchar", length: Article.TITLE_MAX_LENGTH })
  declare title: string;

  static readonly SUBTITLE_MIN_LENGTH = 0;
  static readonly SUBTITLE_MAX_LENGTH = 128;

  @Column({ type: "varchar", length: Article.SUBTITLE_MAX_LENGTH })
  declare subtitle: string;

  @Column({ type: "json" })
  declare content: any;

  @Column({ type: "smallint", unsigned: true, default: 0 })
  declare views: number;

  @CreateDateColumn()
  declare createdAt: Date;
}
