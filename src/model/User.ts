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

@Table
export class User extends Model {
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

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(32))
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
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
