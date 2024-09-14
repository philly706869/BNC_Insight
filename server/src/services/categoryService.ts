import { Category } from "@/database/models/Category";
import { categoryRepository } from "@/database/repositories";

export async function findCategoryByName(
  name: string
): Promise<Category | null> {
  return await categoryRepository.findOne({ where: { name } });
}
