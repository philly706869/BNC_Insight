import { Category } from "@/database/entities/category";
import { categoryRepository } from "@/database/repositories";

export async function findCategory(name: string): Promise<Category | null> {
  return await categoryRepository.findOne({ where: { name } });
}
