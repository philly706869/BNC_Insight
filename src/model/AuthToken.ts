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
  Unique,
} from "sequelize-typescript";
import { User } from "./User.js";

@Table
export class AuthToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  static readonly TOKEN_MIN_LENGTH = 1;
  static readonly TOKEN_MAX_LENGTH = 128;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(AuthToken.TOKEN_MAX_LENGTH))
  declare token: string;

  static validateToken(value: string) {
    const min = AuthToken.TOKEN_MIN_LENGTH;
    const max = AuthToken.TOKEN_MAX_LENGTH;
    return value.length >= min && value.length <= max;
  }

  @Unique
  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => User)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare allocedUserUid: number | null;

  @BelongsTo(() => User)
  declare allocedUser: User | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isAdminToken: boolean;
}
