import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({})
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  public uid!: number;

  @AllowNull(false)
  @Column(DataType.UUIDV4)
  public uuid!: string;

  @AllowNull(false)
  @Column(DataType.STRING(320))
  public email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(60).BINARY)
  public password!: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  public name!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  public creationDate!: Date;
}
