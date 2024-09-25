import { Category } from "@/database/entities/category";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";

export type CategoryDTOProps = ClassToObject<CategoryDTO>;

export const categoryFindSelection = {
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Readonly<FindOptionsSelect<Category>>;

export class CategoryDTO {
  public name: string;
  public createdAt: string;
  public updatedAt: string;

  public constructor(props: CategoryDTOProps) {
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static from(category: Category): CategoryDTO {
    return new CategoryDTO({
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    });
  }
}
