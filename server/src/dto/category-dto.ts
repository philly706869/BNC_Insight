import { ClassToObject } from "@util-types";

export type CategoryDTOProps = ClassToObject<CategoryDTO>;

export class CategoryDTO {
  public readonly name: string;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public constructor(props: CategoryDTOProps) {
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
