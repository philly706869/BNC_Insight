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

export namespace Category {
  export class Name {
    private static readonly regex = /^[^\n]*$/;
    public static readonly min = metadata.name.min;
    public static readonly max = metadata.name.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | { error: string } {
      const { regex, min, max } = Name;
      const errors: string[] = [];

      if (!regex.test(value)) errors.push("Name cannot contain line breaks.");

      if (value.length < min)
        errors.push(`Name cannot be shorter than ${min} characters.`);
      else if (value.length > max)
        errors.push(`Name cannot be greater than ${max} characters.`);

      if (errors.length) return { error: errors.join(" ") };

      return new Name(value);
    }
  }
}
@Entity("categories")
export class Category {
  @PrimaryColumn({ type: "varchar", length: Category.Name.max })
  public declare name: string;

  @OneToMany((type) => Article, (article) => article.category)
  public declare articles: Article[];

  @CreateDateColumn()
  public declare createdAt: Date;

  @UpdateDateColumn()
  public declare updatedAt: Date;
}
