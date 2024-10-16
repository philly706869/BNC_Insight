import { env } from "@/env";
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./article";

const config = env.category;

@Entity("categories")
export class Category {
  private constructor() {}

  @PrimaryColumn({ type: "varchar", length: config.maxNameLength })
  public declare name: string;

  @OneToMany((type) => Article, (article) => article.category)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;
}
