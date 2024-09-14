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

  private static nameRegex = /^[^\n]*$/;
  static verifyName(value: string): string | null {
    const errors: string[] = [];

    if (!Category.nameRegex.test(value))
      errors.push("Name cannot contain line breaks.");

    const { min, max } = metadata.name;
    if (value.length < min)
      errors.push(`Name cannot be shorter than ${min} characters.`);
    else if (value.length > max)
      errors.push(`Name cannot be greater than ${max} characters.`);

    if (errors.length) return errors.join(" ");
    return null;
  }
}
