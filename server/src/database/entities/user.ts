import { config } from "@/config";
import { BCRYPT_HASH_LENGTH } from "@/utils/constants";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./article";

const conf = config.user;

@Entity("users")
export class User {
  private constructor() {}

  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  public declare uid: number;

  @Column({ type: "varchar", length: conf.maxUsernameLength, unique: true })
  public declare username: string;

  @Column({ type: "binary", length: BCRYPT_HASH_LENGTH })
  public declare passwordHash: Buffer;

  @Column({ type: "varchar", length: conf.maxNameLength })
  public declare name: string;

  @Column({ type: "boolean", default: false })
  public declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;
}
