import { Article } from "@/database/entities/article";
import { ClassToObject } from "@/types/utils";
import { PublicUserDTO, PublicUserDTOProps } from "./public-user-dto";

export type ArticleDTOProps = ClassToObject<ArticleDTO>;

export class ArticleDTO {
  public id: number;
  public uploader: PublicUserDTOProps;
  public categoryName: string;
  public thumbnailUrl: string;
  public title: string;
  public subtitle: string;
  public content: any;
  public createdAt: string;
  public updatedAt: string;

  public constructor(props: ArticleDTOProps) {
    this.id = props.id;
    this.uploader = props.uploader;
    this.categoryName = props.categoryName;
    this.thumbnailUrl = props.thumbnailUrl;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static from(article: Article): ArticleDTO {
    return new ArticleDTO({
      ...article,
      uploader: new PublicUserDTO(article.uploader),
      categoryName: article.category.name,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  }
}
