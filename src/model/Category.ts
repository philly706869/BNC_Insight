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

  static validateName(name: string) {
    const errors: string[] = [];

    if (name.trim() !== name)
      errors.push("Category cannot start or end with a space.");

    if (name.includes("\n"))
      errors.push("Category cannot contain line breaks.");

    switch (true) {
      case name.length < 1:
        errors.push("Category cannot be empty");
        break;
      case name.length > 16:
        errors.push("Category cannot be greater than 64 characters.");
        break;
    }

    return errors.length !== 0 ? errors : null;
  }
}
