import { env } from "@/env";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

const metadata = env.database.model.authToken;

@Entity("auth_tokens")
export class AuthToken {
  @PrimaryColumn({ type: "varchar", length: AuthToken.Token.max })
  public declare token: string;

  @Column({ type: "boolean", default: false })
  public declare isAdminToken: boolean;

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;

  public static readonly Token = class Token {
    public static readonly min = metadata.token.min;
    public static readonly max = metadata.token.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Token | { error: string } {
      const { min, max } = Token;
      const error = { error: "Invalid token." };

      if (value.length < min) return error;
      else if (value.length > max) return error;

      return new Token(value);
    }
  };
}
