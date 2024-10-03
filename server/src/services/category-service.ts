import { DataSource } from "typeorm";

export class CategoryService {
  public constructor(private readonly dataSource: DataSource) {}
}
