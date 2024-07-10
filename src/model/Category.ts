import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Article } from "./Article.js";

@Table
export class Category extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(16))
  declare name: string;

  @HasMany(() => Article)
  declare articles: Article[];
}
