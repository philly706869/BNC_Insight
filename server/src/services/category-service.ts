import { Category } from "@/database/entities/category";
import { CategoryValue } from "@/database/values/category-values";
import { CategoryDTO } from "@/dto/category-dto";
import {
  CategoryNameDTO,
  categoryNameFindSelection,
} from "@/dto/category-name-dto";
import { CategoryNotFoundError } from "@/errors/service-errors";
import { DataSource, Repository } from "typeorm";

export class CategoryService {
  private readonly categoryRepository: Repository<Category>;

  public constructor(dataSource: DataSource) {
    this.categoryRepository = dataSource.getRepository(Category);
  }

  public async getAll(): Promise<CategoryNameDTO[]> {
    const categories = await this.categoryRepository.find({
      select: categoryNameFindSelection,
    });
    return categories.map((category) => CategoryNameDTO.from(category));
  }

  public async post(name: CategoryValue.Name): Promise<CategoryDTO> {
    const category = await this.categoryRepository.save(
      this.categoryRepository.create({ name: name.value })
    );
    return CategoryDTO.from(category);
  }

  /**
   * @throws {CategoryNotFoundError}
   */
  public async patch(
    name: CategoryValue.Name,
    data: { name?: CategoryValue.Name }
  ): Promise<void> {
    const result = await this.categoryRepository.update(
      { name: name.value },
      { name: data.name?.value }
    );
    if (!Boolean(result.affected))
      return Promise.reject(new CategoryNotFoundError());
  }

  /**
   * @throws {CategoryNotFoundError}
   */
  public async delete(name: CategoryValue.Name): Promise<void> {
    const result = await this.categoryRepository.delete({ name: name.value });
    if (!Boolean(result.affected))
      return Promise.reject(new CategoryNotFoundError());
  }
}
