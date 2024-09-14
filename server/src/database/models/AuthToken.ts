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
  @PrimaryColumn({ type: "varchar", length: metadata.token.max })
  declare token: string;

  @Column({ type: "boolean", default: false })
  declare isAdminToken: boolean;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  static verifyToken(value: string): boolean {
    const { min, max } = metadata.token;
    if (value.length < min) return false;
    else if (value.length > max) return false;

    return true;
  }
}
