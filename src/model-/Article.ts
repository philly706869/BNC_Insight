import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ modelName: "articles" })
export class Article extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uid: number;

  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare uploaderUid: number;

  @AllowNull(false)
  @Column(DataType.ENUM("temp"))
  declare category: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  declare title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare content: string;
}
