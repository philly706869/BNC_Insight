import { env } from "@/env";
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

const { id: idMeta, name: nameMeta } = env.database.model.user;

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint", unsigned: true })
  declare uid: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  declare uuid: string;

  @Column({ type: "varchar", length: idMeta.max, unique: true })
  declare id: string;

  @Column({ type: "binary", length: 60 /* bcrypt 해시값 고정 길이 */ })
  declare passwordHash: Buffer;

  @Column({ type: "varchar", length: nameMeta.max })
  declare name: string;

  @Column({ type: "boolean", default: false })
  declare isAdmin: boolean;

  @OneToMany((type) => Article, (article) => article.uploader)
  declare articles: Article[];

  @CreateDateColumn()
  declare createdAt: Date;
}
