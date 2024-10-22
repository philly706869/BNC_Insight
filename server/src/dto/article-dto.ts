import { ClassToObject } from "@/types/utils";
import { ContentlessArticleDTO } from "./contentless-article-dto";

export type ArticleDTOProps = ClassToObject<ArticleDTO>;

export class ArticleDTO extends ContentlessArticleDTO {
  public readonly content: string;

  public constructor(props: ArticleDTOProps) {
    super(props);
    this.content = props.content;
  }
}
