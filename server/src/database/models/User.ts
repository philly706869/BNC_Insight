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

  @Column({ type: "varchar", length: User.Username.max, unique: true })
  public declare username: string;

  @Column({ type: "binary", length: User.Password.hashLength })
  public declare passwordHash: Buffer;

  @Column({ type: "varchar", length: User.Name.max })
  public declare name: string;

  @Column({ type: "boolean", default: false })
  public declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;

  public static readonly Username = class Username {
    private static readonly regex = /^[a-z\d]*$/;
    public static readonly min = metadata.username.min;
    public static readonly max = metadata.username.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Username | { error: string } {
      const { regex, min, max } = Username;
      const errors: string[] = [];

      if (!regex.test(value))
        errors.push("Username can only contain alphanumeric characters.");

      if (value.length < min)
        errors.push(`Username cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Username cannot be greater than ${max} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Username(value);
    }
  };

  public static readonly Password = class Password {
    private static readonly regex =
      /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;
    public static readonly min = metadata.password.min;
    public static readonly max = metadata.password.max;
    public static readonly byteMax = BCRYPT_MAX_BYTE_LENGTH;
    public static readonly hashLength = BCRYPT_HASH_LENGTH;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Password | { error: string } {
      const { regex, min, max, byteMax } = Password;
      const errors: string[] = [];

      if (!regex.test(value))
        errors.push(
          "Password can only contain alphanumeric characters and common punctuation characters."
        );

      if (value.length < min)
        errors.push(`Password cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Password cannot be greater than ${max} characters.`);
      else if (Buffer.byteLength(value) > byteMax)
        errors.push(`Password cannot be greater than ${byteMax} bytes.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Password(value);
    }
  };

  public static readonly Name = class Name {
    private static readonly regex = /^[a-z\d]*$/;
    public static readonly min = metadata.name.min;
    public static readonly max = metadata.name.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | { error: string } {
      const { regex, min, max } = Name;
      const errors: string[] = [];

      if (!regex.test(value))
        errors.push("Name can only contain alphanumeric characters.");

      if (value.length < min)
        errors.push(`Name cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Name cannot be greater than ${min} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Name(value);
    }
  };
}
