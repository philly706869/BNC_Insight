import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("auth_tokens")
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  static readonly TOKEN_MIN_LENGTH = 1;
  static readonly TOKEN_MAX_LENGTH = 128;

  @Column({ type: "varchar", length: AuthToken.TOKEN_MAX_LENGTH, unique: true })
  declare token: string;

  static validateToken(value: string) {
    const min = AuthToken.TOKEN_MIN_LENGTH;
    const max = AuthToken.TOKEN_MAX_LENGTH;
    return value.length >= min && value.length <= max;
  }

  @OneToOne((type) => User, (user) => user.authToken, { nullable: true })
  declare allocedUser: User | null;

  @Column({ type: "boolean", default: false })
  declare isAdminToken: boolean;

  @CreateDateColumn()
  declare createdAt: Date;
}
