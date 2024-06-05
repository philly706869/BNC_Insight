import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({ modelName: "auth_tokens" })
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
  @Column(DataType.SMALLINT.UNSIGNED)
  declare allocedUserUid: number | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isAdminToken: boolean;
}

export const isAllocableToken = async (token: string) => {
  if (token.length < 1 || token.length > 128) return false;
  const authToken = await AuthToken.findOne({ where: { token } });
  return authToken !== null && authToken.allocedUserUid === null;
};
