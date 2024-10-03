import { Article } from "@/database/entities/article";
import { Category } from "@/database/entities/category";
import { User } from "@/database/entities/user";
import { ArticleValue } from "@/database/values/article-values";
import { CategoryValue } from "@/database/values/category-values";
import { ArticleDTO, articleFindSelection } from "@/dto/article-dto";
import {
  ContentlessArticleDTO,
  contentlessArticleFindSelection,
} from "@/dto/contentless-article-dto";
import { DataSource, Repository } from "typeorm";

export class ArticleService {
  private readonly userRepository: Repository<User>;
  private readonly categoryRepository: Repository<Category>;
  private readonly articleRepository: Repository<Article>;

  public constructor(private readonly dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.categoryRepository = dataSource.getRepository(Category);
    this.articleRepository = dataSource.getRepository(Article);
    dataSource.manager
  }

  public async getOne(id: number): Promise<ArticleDTO | null> {
    const article = await this.articleRepository.findOne({
      where: { id },
      select: articleFindSelection,
    });
    return article ? ArticleDTO.from(article) : null;
  }

  public async getMany(
    categoryName: CategoryValue.Name,
    offset: number,
    limit: number
  ): Promise<ContentlessArticleDTO[]> {
    offset = Math.max(0, offset);
    limit = Math.max(0, Math.min(30, limit));

    const category = await this.categoryRepository.findOne({
      where: { name: categoryName.value },
      select: { name: true },
    });
    if (!category) return [];

    const articles = await this.articleRepository.find({
      where: { category },
      select: contentlessArticleFindSelection,
      skip: offset,
      take: limit,
    });
    return articles.map((article) => ContentlessArticleDTO.from(article));
  }

  public async post(
    uploaderUid: number,
    categoryName: CategoryValue.Name,
    thumbnailUrl: ArticleValue.ThumbnailUrl | null,
    thumbnailCaption: ArticleValue.ThumbnailCaption | null,
    title: ArticleValue.Title,
    subtitle: ArticleValue.Subtitle,
    content: ArticleValue.Content
  ): Promise<ContentlessArticleDTO> {
    const uploader = await this.userRepository.findOne({
      where: { uid: uploaderUid },
      select: { uid: true },
    });
    if (!uploader) throw new Error();

    const category = await this.categoryRepository.findOne({
      where: { name: categoryName.value },
      select: { name: true },
    });
    if (!category) throw new Error();

    const article = await this.articleRepository.save(
      this.articleRepository.create({
        uploader: uploader,
        category: category,
        thumbnailUrl: thumbnailUrl?.value,
        thumbnailCaption: thumbnailCaption
        title: title.value,
        subtitle: subtitle.value,
        content: content.value,
      })
    );

    return ContentlessArticleDTO.from(article);
  }
}
