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
  declare uid: number;

  @Column({ type: "varchar", length: metadata.username.max, unique: true })
  declare username: string;

  @Column({ type: "binary", length: BCRYPT_HASH_LENGTH })
  declare passwordHash: Buffer;

  @Column({ type: "varchar", length: metadata.name.max })
  declare name: string;

  @Column({ type: "boolean", default: false })
  declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  declare articles: Article[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  private static usernameRegex = /^[a-z\d]*$/;
  static verifyUsername(value: string): string | null {
    const errors: string[] = [];

    if (!User.usernameRegex.test(value))
      errors.push("Username can only contain alphanumeric characters.");

    const { min, max } = metadata.username;
    if (value.length < min)
      errors.push(`Username cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Username cannot be greater than ${max} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }

  private static passwordRegex =
    /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;
  static verifyPassword(value: string): string | null {
    const errors: string[] = [];

    if (!User.passwordRegex.test(value))
      errors.push(
        "Password can only contain alphanumeric characters and common punctuation characters."
      );

    const { min, max } = metadata.password;
    const byteMax = BCRYPT_MAX_BYTE_LENGTH;
    if (value.length < min)
      errors.push(`Password cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Password cannot be greater than ${max} characters.`);
    else if (Buffer.byteLength(value) > byteMax)
      errors.push(`Password cannot be greater than ${byteMax} bytes.`);

    if (errors.length) return errors.join(" ");
    return null;
  }

  private static nameRegex = /^[a-z\d]*$/;
  static verifyName(value: string): string | null {
    const errors: string[] = [];

    if (!User.nameRegex.test(value))
      errors.push("Name can only contain alphanumeric characters.");

    const { min, max } = metadata.name;
    if (value.length < min)
      errors.push(`Name cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Name cannot be greater than ${min} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }
}
