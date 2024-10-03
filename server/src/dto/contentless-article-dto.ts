import { Article } from "@/database/entities/article";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";
import { PublicUserDTO, PublicUserDTOProps } from "./public-user-dto";

export type ArticleDTOProps = ClassToObject<ContentlessArticleDTO>;

export const contentlessArticleFindSelection = {
  id: true,
  category: { name: true },
  thumbnailUrl: true,
  title: true,
  subtitle: true,
  uploader: { username: true, name: true },
  createdAt: true,
  updatedAt: true,
} satisfies Readonly<FindOptionsSelect<Article>>;

export class ContentlessArticleDTO {
  public readonly id: number;
  public readonly uploader: PublicUserDTOProps;
  public readonly categoryName: string;
  public readonly thumbnailUrl: string;
  public readonly title: string;
  public readonly subtitle: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  public constructor(props: ArticleDTOProps) {
    this.id = props.id;
    this.uploader = props.uploader;
    this.categoryName = props.categoryName;
    this.thumbnailUrl = props.thumbnailUrl;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static from(article: Article): ContentlessArticleDTO {
    return new ContentlessArticleDTO({
      ...article,
      uploader: new PublicUserDTO(article.uploader),
      categoryName: article.category.name,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  }
}
