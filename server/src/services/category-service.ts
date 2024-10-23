import { Database } from "@/database/database";
import { categoryTable } from "@/database/tables/category";
import { CategoryValue } from "@/database/values/category-values";
import { CategoryNameDTO } from "@/dto/category-name-dto";
import { CategoryNotFoundError } from "@/errors/service-errors";
import { eq } from "drizzle-orm";

export class CategoryService {
  public constructor(private readonly database: Database) {}

  public async getAll(): Promise<CategoryNameDTO[]> {
    const categories = await this.database
      .select({
        name: categoryTable.name,
      })
      .from(categoryTable)
      .execute();
    return categories.map((category) => new CategoryNameDTO(category));
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
    name: CategoryValue.Name,
    data: { name?: CategoryValue.Name }
  ): Promise<void> {
    const [header] = await this.database
      .update(categoryTable)
      .set({ name: data.name?.value })
      .where(eq(categoryTable.name, name.value))
      .execute();

    if (!Boolean(header.affectedRows)) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }

  /**
   * @throws {CategoryNotFoundError}
   */
  public async delete(name: CategoryValue.Name): Promise<void> {
    const [header] = await this.database
      .delete(categoryTable)
      .where(eq(categoryTable.name, name.value))
      .execute();

    if (!Boolean(header.affectedRows)) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }
}
