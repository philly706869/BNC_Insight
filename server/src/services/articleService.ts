import { Article } from "@/database/models/Article";
import { articleRepository } from "@/database/repositories";

export async function findArticleById(id: number): Promise<Article | null> {
  return await articleRepository.findOne({ where: { id } });
}
