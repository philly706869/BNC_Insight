import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auth_tokens")
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  static readonly TOKEN_MIN_LENGTH = 1;
  static readonly TOKEN_MAX_LENGTH = 128;

  @Column({ type: "varchar", length: AuthToken.TOKEN_MAX_LENGTH })
  declare token: string;

  static validateToken(value: string): string[] | null {
    const errors: string[] = [];

    const min = AuthToken.TOKEN_MIN_LENGTH;
    const max = AuthToken.TOKEN_MAX_LENGTH;
    switch (true) {
      case value.length < min:
        errors.push(`Token cannot be shorter than ${min} charaters.`);
        break;
      case value.length > max:
        errors.push(`Token cannot be greater than ${max} charaters.`);
        break;
    }
    return errors.length ? errors : null;
  }

  @Column({ type: "boolean", default: false })
  declare isAdminToken: boolean;

  @CreateDateColumn()
  declare createdAt: Date;
}
