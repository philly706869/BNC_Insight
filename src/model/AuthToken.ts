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

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare token: string;

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

  static async isAllocable(token: string) {
    if (token.length < 1 || token.length > 128) return false;
    const authToken = await AuthToken.findOne({ where: { token } });
    return authToken !== null && authToken.allocedUserUid === null;
  }
}
