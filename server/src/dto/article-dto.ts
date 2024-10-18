import { Article } from "@/database/entities/article";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";
import { categoryNameFindSelection } from "./category-name-dto";
import {
  PublicUserDTO,
  PublicUserDTOProps,
  publicUserFindSelection,
} from "./public-user-dto";

export type ArticleDTOProps = ClassToObject<ArticleDTO>;

export const articleFindSelection = {
  id: true,
  category: categoryNameFindSelection,
  thumbnailUrl: true,
  title: true,
  subtitle: true,
  content: true,
  uploader: publicUserFindSelection,
  createdAt: true,
  updatedAt: true,
} satisfies Readonly<FindOptionsSelect<Article>>;

export class ArticleDTO {
  public readonly id: number;
  public readonly uploader: PublicUserDTOProps;
  public readonly category: string | null;
  public readonly thumbnail: {
    readonly url: string;
    readonly caption: string;
  };
  public readonly title: string;
  public readonly subtitle: string;
  public readonly content: any;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  public constructor(props: ArticleDTOProps) {
    this.id = props.id;
    this.uploader = props.uploader;
    this.category = props.category;
    this.thumbnail = props.thumbnail;
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
      category: article.category?.name ?? null,
      thumbnail: {
        url: article.thumbnailUrl,
        caption: article.thumbnailCaption,
      },
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  }
}
