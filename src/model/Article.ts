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
  @Column(DataType.STRING(16))
  declare categoryName: string;

  @BelongsTo(() => Category)
  declare category: Category;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  declare title: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare subtitle: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare content: any;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare views: number;
}
