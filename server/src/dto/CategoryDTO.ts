import { Category } from "@/database/entities/Category";
import { ClassToObject } from "@/types/utils";

export type CategoryDTOProps = ClassToObject<CategoryDTO>;

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
