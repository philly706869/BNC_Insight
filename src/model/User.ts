import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Article } from "./Article.js";
import { AuthToken } from "./AuthToken.js";
import { IntegerRanges } from "./IntegerRange.js";

class InvalidNameError {
  messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}

@Table
export class User extends Model {
  static UID_MIN = IntegerRanges.SMALLINT.UNSIGNED.MIN + 1;
  static UID_MAX = IntegerRanges.SMALLINT.UNSIGNED.MAX;
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.UUID)
  declare uuid: string;

  @HasOne(() => AuthToken)
  declare authToken: AuthToken;

  static ID_LENGTH_MIN = 1;
  static ID_LENGTH_MAX = 32;
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(User.ID_LENGTH_MAX))
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  get name(): string {
    return this.getDataValue("name");
  }

  set name(value: string) {
    const errors: string[] = [];

    if (!/^\w*?$/.test(value))
      errors.push("Id can only contain letters, numbers, and underline.");

    switch (true) {
      case value.length < 1:
        errors.push("Id cannot be empty.");
        break;
      case value.length > 32:
        errors.push("Id cannot be greater than 32 characters.");
        break;
    }

    if (errors.length !== 0) throw new InvalidNameError(errors);

    this.setDataValue("name", value);
  }

  @AllowNull(false)
  @Column
  declare isAdmin: boolean;

  @HasMany(() => Article)
  declare articles: Article[];

  static async findUserById(id: string) {
    return await User.findOne({ where: { id: id.toLowerCase() } });
  }

  static validateId(id: string) {
    const errors: string[] = [];

    if (!/^\w*?$/.test(id))
      errors.push("Id can only contain letters, numbers, and underline.");

    switch (true) {
      case id.length < 1:
        errors.push("Id cannot be empty.");
        break;
      case id.length > 32:
        errors.push("Id cannot be greater than 32 characters.");
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  static validatePassword(password: string) {
    const errors: string[] = [];

    if (!/^[!"#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*?$/.test(password))
      errors.push(
        "Password can only contain letters, numbers, and common punctuation characters."
      );

    switch (true) {
      case password.length < 8:
        errors.push("Password cannot be shorter than 8 charaters.");
        break;
      case password.length > 72:
        errors.push("Password cannot be greater than 72 charaters.");
        break;
    }

    return errors.length !== 0 ? errors : null;
  }

  static validateName(name: string) {
    const errors: string[] = [];

    if (name.trim() !== name)
      errors.push("Name cannot start or end with a space.");

    if (name.includes("\n")) errors.push("Name cannot contain line breaks.");

    switch (true) {
      case name.length < 1:
        errors.push("Name cannot be empty");
        break;
      case name.length > 64:
        errors.push("Name cannot be greater than 64 characters.");
        break;
    }

    return errors.length !== 0 ? errors : null;
  }
}
