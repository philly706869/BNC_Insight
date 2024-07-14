import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Category } from "./Category.js";
import { User } from "./User.js";

@Table
export class Article extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uploaderUid: number;

  @BelongsTo(() => User)
  declare uploader: User;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column(DataType.STRING(Category.NAME_MAX_LENGTH))
  declare categoryName: string;

  @BelongsTo(() => Category)
  declare category: Category;

  static readonly TITLE_MIN_LENGTH = 1;
  static readonly TITLE_MAX_LENGTH = 64;

  @AllowNull(false)
  @Column(DataType.STRING(Article.TITLE_MAX_LENGTH))
  declare title: string;

  static readonly SUBTITLE_MIN_LENGTH = 0;
  static readonly SUBTITLE_MAX_LENGTH = 128;

  @AllowNull(false)
  @Column(DataType.STRING(Article.SUBTITLE_MAX_LENGTH))
  declare subtitle: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare content: any;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare views: number;
}
