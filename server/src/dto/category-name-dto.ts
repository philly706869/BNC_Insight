import { Category } from "@/database/entities/category";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";

export type CategoryDTOProps = ClassToObject<CategoryNameDTO>;

export const categoryNameFindSelection = {
  name: true,
} satisfies Readonly<FindOptionsSelect<Category>>;

export class CategoryNameDTO {
  public name: string;

  public constructor(props: CategoryDTOProps) {
    this.name = props.name;
  }

  public static from(category: Category): CategoryNameDTO {
    return new CategoryNameDTO(category);
  }
}
