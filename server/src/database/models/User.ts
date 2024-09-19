import { env } from "@/env";
import { BCRYPT_HASH_LENGTH, BCRYPT_MAX_BYTE_LENGTH } from "@/utils/constants";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./Article";

const metadata = env.database.model.user;

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  public declare uid: number;

  @Column({ type: "varchar", length: metadata.username.max, unique: true })
  public declare username: string;

  @Column({ type: "binary", length: BCRYPT_HASH_LENGTH })
  public declare passwordHash: Buffer;

  @Column({ type: "varchar", length: metadata.name.max })
  public declare name: string;

  @Column({ type: "boolean", default: false })
  public declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;

  private static readonly usernameRegex = /^[a-z\d]*$/;
  public static verifyUsername(value: string): boolean {
    if (!User.usernameRegex.test(value)) return false;
    const { min, max } = metadata.username;
    if (value.length < min) return false;
    if (value.length > max) return false;
    return true;
  }

  private static readonly passwordRegex =
    /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;
  public static verifyPassword(value: string): boolean {
    if (!User.usernameRegex.test(value)) return false;
    const { min, max } = metadata.password;
    if (value.length < min) return false;
    if (value.length > max) return false;
    if (Buffer.byteLength(value) > BCRYPT_MAX_BYTE_LENGTH) return false;
    return true;
  }

  private static readonly nameRegex = /^[a-z\d]*$/;
  public static verifyName(value: string): boolean {
    if (!User.nameRegex.test(value)) return false;
    const { min, max } = metadata.name;
    if (value.length < min) return false;
    if (value.length > max) return false;
    return true;
  }
}
