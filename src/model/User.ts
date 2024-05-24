import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ modelName: "users" })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @AllowNull(false)
  @Column(DataType.UUID)
  declare uuid: string;

  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare tokenUid: number;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isAdmin: boolean;
}

export default User;
