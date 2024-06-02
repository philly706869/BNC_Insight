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

@Table({ modelName: "users", charset: "", collate: "" })
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

  @Unique
  @AllowNull(false)
  @Column(DataType.SMALLINT.UNSIGNED)
  declare tokenUid: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(32) + " CHARACTER SET ascii COLLATE ascii_general_ci")
  declare id: string;

  @AllowNull(false)
  @Column(
    DataType.STRING(60).BINARY + " CHARACTER SET ascii COLLATE ascii_general_ci"
  )
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isAdmin: boolean;
}

const idRegex = /^\w{1,32}?$/;
const passwordRegex = /^[!"#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]{8,72}?$/;
const nameRegex = /^\S([^\n]{0,62}?\S)?$/;

export const isValidUserId = (id: string) => idRegex.test(id);
export const isValidUserPassword = (password: string) =>
  passwordRegex.test(password);
export const isValidUserName = (name: string) => nameRegex.test(name);

export const checkUserById = async (id: string, checkValid: boolean) =>
  checkValid &&
  isValidUserId(id) &&
  (await User.findOne({ where: { id: id.toLowerCase() } })) !== null;
