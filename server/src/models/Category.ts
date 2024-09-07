import { env } from "@/env";
import { BaseEntity, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Article } from "./Article";

const { name: nameMeta } = env.database.model.category;

@Entity("categories")
export class Category extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: nameMeta.max })
  declare name: string;

  @OneToMany((type) => Article, (article) => article.category)
  declare articles: Article[];
}
