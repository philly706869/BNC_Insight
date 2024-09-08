import { Category } from "@/database/models/Category";
import { categoryRepository } from "@/database/repositories";
import { CategoryName } from "@/valueObjects/categoryValueObjects";

export async function findCategoryByName(
  name: CategoryName
): Promise<Category | null> {
  return await categoryRepository.findOne({ where: { name: name.value } });
}
