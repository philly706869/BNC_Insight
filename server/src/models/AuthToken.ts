import { env } from "@/env";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

const { token: tokenMeta } = env.database.model.authToken;

@Entity("auth_tokens")
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  @Column({ type: "varchar", length: tokenMeta.max })
  declare token: string;

  @Column({ type: "boolean", default: false })
  declare isAdminToken: boolean;

  @CreateDateColumn()
  declare createdAt: Date;
}
