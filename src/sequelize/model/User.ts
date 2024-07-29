import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Article } from "./Article.js";
import { AuthToken } from "./AuthToken.js";

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @Unique
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare uuid: string;

  @HasOne(() => AuthToken)
  declare authToken: AuthToken;

  static readonly IDENTIFIER_MIN_LENGTH = 1;
  static readonly IDENTIFIER_MAX_LENGTH = 32;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(User.IDENTIFIER_MAX_LENGTH))
  declare id: string;

  static validateId(value: string) {
    const errors: string[] = [];

    if (!/^\w*?$/.test(value))
      errors.push(`Id can only contain letters, numbers, and underline.`);

    const min = User.IDENTIFIER_MIN_LENGTH;
    const max = User.IDENTIFIER_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Id cannot be shorter than ${min} characters.`);
        break;
      case value.length > max:
        errors.push(`Id cannot be greater than ${max} characters.`);
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  static readonly PASSWORD_MIN_LENGTH = 8;
  static readonly PASSWORD_MAX_LENGTH = 72;

  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  declare password: string;

  static validatePassword(value: string) {
    const errors: string[] = [];

    if (!/^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*?$/.test(value))
      errors.push(
        `Password can only contain letters, numbers, and common punctuation characters.`
      );

    const min = User.PASSWORD_MIN_LENGTH;
    const max = User.PASSWORD_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Password cannot be shorter than ${min} charaters.`);
        break;
      case value.length > max:
        errors.push(`Password cannot be greater than ${max} charaters.`);
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  static readonly NAME_MIN_LENGTH = 1;
  static readonly NAME_MAX_LENGTH = 64;

  @AllowNull(false)
  @Column(DataType.STRING(User.NAME_MAX_LENGTH))
  declare name: string;

  static validateName(value: string) {
    const errors: string[] = [];

    if (!/^\w*?$/.test(value))
      errors.push(`Id can only contain letters, numbers, and underline.`);

    const min = User.NAME_MIN_LENGTH;
    const max = User.NAME_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Id cannot be shorter than ${min} characters.`);
        break;
      case value.length > max:
        errors.push(`Id cannot be greater than ${max} characters.`);
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isAdmin: boolean;

  @HasMany(() => Article)
  declare articles: Article[];
}
