import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ modelName: "auth_tokens" })
export class AuthToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare token: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare allocedUserUid: number | null;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isAdminToken: boolean;
}
