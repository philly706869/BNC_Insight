import { Database } from "@/database/database";
import { categoryTable } from "@/database/tables/category-table";
import { CategoryDTO } from "@/dto/category-dto";
import { CategoryNotFoundError } from "@/errors/service-errors";
import { CategoryValue } from "@/value-objects/category-values";
import { asc, eq } from "drizzle-orm";

export class CategoryService {
  public constructor(private readonly database: Database) {}

  public async getAll(): Promise<CategoryDTO[]> {
    const categories = await this.database
      .select({
        name: categoryTable.name,
        createdAt: categoryTable.createdAt,
        updatedAt: categoryTable.updatedAt,
      })
      .from(categoryTable)
      .orderBy(asc(categoryTable.name))
      .execute();

    return categories.map(
      (category) =>
        new CategoryDTO({
          name: category.name,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        })
    );
  }

  public async post(name: CategoryValue.Name): Promise<void> {
    await this.database
      .insert(categoryTable)
      .values({ name: name.value })
      .execute();
  }

  /**
   * @throws {CategoryNotFoundError}
   */
  public async patch(
    categoryName: string,
    data: { name?: CategoryValue.Name }
  ): Promise<void> {
    const [header] = await this.database
      .update(categoryTable)
      .set({ name: data.name?.value })
      .where(eq(categoryTable.name, categoryName))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }

  /**
   * @throws {CategoryNotFoundError}
   */
  public async delete(categoryName: string): Promise<void> {
    const [header] = await this.database
      .delete(categoryTable)
      .where(eq(categoryTable.name, categoryName))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }
}
