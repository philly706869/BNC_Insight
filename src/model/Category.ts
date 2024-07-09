import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table
export class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare name: string;
}
