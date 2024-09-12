import { env } from "@/env";
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./Article";

const metadata = env.database.model.category;

@Entity("categories")
export class Category {
  @PrimaryColumn({ type: "varchar", length: metadata.name.max })
  declare name: string;

  @OneToMany((type) => Article, (article) => article.category)
  declare articles: Article[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
