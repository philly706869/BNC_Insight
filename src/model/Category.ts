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

class InvalidNameError {
  messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}

@Table
export class Category extends Model {
  static readonly NAME_MIN_LENGTH = 1;
  static readonly NAME_MAX_LENGTH = 16;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(Category.NAME_MAX_LENGTH))
  declare name: string;

  static validateName(value: string) {
    const errors: string[] = [];

    if (value.trim() !== value)
      errors.push(`Category cannot start or end with a space.`);

    if (value.includes(`\n`))
      errors.push(`Category cannot contain line breaks.`);

    const min = Category.NAME_MIN_LENGTH;
    const max = Category.NAME_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Category cannot be shorter than ${min} characters.`);
        break;
      case value.length > max:
        errors.push(`Category cannot be greater than ${max} characters.`);
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  @HasMany(() => Article)
  declare articles: Article[];
}
