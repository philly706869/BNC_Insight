import { env } from "@/env";
import { BCRYPT_HASH_LENGTH } from "@/utils/constants";
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
}
