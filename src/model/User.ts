import bcrypt from "bcrypt";
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

class InvalidIdentifierError {
  messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}

class InvalidPasswordError {
  messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}

class InvalidNameError {
  messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}

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

  static IDENTIFIER_MIN_LENGTH = 1;
  static IDENTIFIER_MAX_LENGTH = 32;
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(User.IDENTIFIER_MAX_LENGTH))
  get identifier(): string {
    return this.getDataValue(`identifier`);
  }

  set identifier(value: string) {
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

    if (errors.length !== 0) throw new InvalidIdentifierError(errors);

    this.setDataValue(`identifier`, value.toLowerCase());
  }

  static PASSWORD_MIN_LENGTH = 8;
  static PASSWORD_MAX_LENGTH = 72;
  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  get password(): string {
    return this.getDataValue(`password`);
  }

  set password(value: string) {
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

    if (errors.length !== 0) throw new InvalidPasswordError(errors);

    const hash = bcrypt.hashSync(value, 10);

    this.setDataValue(`password`, hash);
  }

  static NAME_MIN_LENGTH = 1;
  static NAME_MAX_LENGTH = 32;
  @AllowNull(false)
  @Column(DataType.STRING(64))
  get name(): string {
    return this.getDataValue(`name`);
  }

  set name(value: string) {
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

    if (errors.length !== 0) throw new InvalidNameError(errors);

    this.setDataValue(`name`, value);
  }

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isAdmin: boolean;

  @HasMany(() => Article)
  declare articles: Article[];
}
