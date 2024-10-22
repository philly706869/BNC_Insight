import { ClassToObject } from "@/types/utils";

export type CategoryDTOProps = ClassToObject<CategoryNameDTO>;

export class CategoryNameDTO {
  public readonly name: string;

  public constructor(props: CategoryDTOProps) {
    this.name = props.name;
  }
}
