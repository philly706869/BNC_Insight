import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  declare uuid: string;

  static readonly ID_MIN_LENGTH = 1;
  static readonly ID_MAX_LENGTH = 32;

  @Column({ type: "varchar", length: User.ID_MAX_LENGTH, unique: true })
  declare id: string;

  static validateId(value: string): string[] | null {
    const errors: string[] = [];

    if (!/^\w*?$/.test(value))
      errors.push(`Id can only contain letters, numbers, and underline.`);

    const min = User.ID_MIN_LENGTH;
    const max = User.ID_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Id cannot be shorter than ${min} characters.`);
        break;
      case value.length > max:
        errors.push(`Id cannot be greater than ${max} characters.`);
        break;
    }

    return errors.length ? errors : null;
  }

  static readonly PASSWORD_MIN_LENGTH = 8;
  static readonly PASSWORD_MAX_LENGTH = 72;
  static readonly PASSWORD_MAX_BYTES = 72; // PASSWORD_MAX_BYTES는 절대로 72를 초과하면 안됨 (bcrypt의 최대 비교 가능 *바이트* 수)

  @Column({ type: "binary", length: 60 })
  declare password: Buffer;

  static validatePassword(value: string): string[] | null {
    const errors: string[] = [];

    if (!/^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*?$/.test(value))
      errors.push(
        "Password can only contain letters, numbers, and common punctuation characters."
      );

    const min = User.PASSWORD_MIN_LENGTH;
    const max = User.PASSWORD_MAX_LENGTH;
    const byteMax = User.PASSWORD_MAX_BYTES;
    switch (true) {
      case value.length < min:
        errors.push(`Password cannot be shorter than ${min} charaters.`);
        break;
      case value.length > max:
        errors.push(`Password cannot be greater than ${max} charaters.`);
        break;
      case Buffer.byteLength(value) > byteMax:
        errors.push(`Password cannot be greater than ${byteMax} bytes.`);
        break;
    }

    return errors.length ? errors : null;
  }

  static readonly NAME_MIN_LENGTH = 1;
  static readonly NAME_MAX_LENGTH = 16;

  @Column({ type: "varchar", length: User.NAME_MAX_LENGTH })
  declare name: string;

  static validateName(value: string): string[] | null {
    const errors: string[] = [];

    if (!/^\w*?$/.test(value))
      errors.push(`Id can only contain letters, numbers, and underline.`);

    const min = User.NAME_MIN_LENGTH;
    const max = User.NAME_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Id cannot be shorter than ${min} characters.`);
        break;
      case value.length > max:
        errors.push(`Id cannot be greater than ${max} characters.`);
        break;
    }

    return errors.length ? errors : null;
  }

  @Column({ type: "boolean", default: false })
  declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  declare articles: Article[];

  @CreateDateColumn()
  declare createdAt: Date;
}
