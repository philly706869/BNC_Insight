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
  public declare name: string;

  @OneToMany((type) => Article, (article) => article.category)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;

  private static readonly nameRegex = /^[^\n]*$/;
  public static verifyName(value: string): boolean {
    if (!Category.nameRegex.test(value)) return false;
    const { min, max } = metadata.name;
    if (value.length < min) return false;
    if (value.length > max) return false;
    return true;
  }
}
