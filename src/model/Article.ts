import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { categories, Category } from "./categories.js";

@Table({ modelName: "articles" })
export class Article extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uploaderUid: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...categories))
  declare category: Category;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  declare title: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare subtitle: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare content: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare views: number;
}
