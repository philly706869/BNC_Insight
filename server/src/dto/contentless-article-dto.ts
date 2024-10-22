import { ClassToObject } from "@/types/utils";
import { PublicUserDTO } from "./public-user-dto";

export type ContentlessArticleDTOProps = ClassToObject<ContentlessArticleDTO>;

export class ContentlessArticleDTO {
  public readonly uid: number;
  public readonly uploader: PublicUserDTO | null;
  public readonly category: string | null;
  public readonly thumbnail: {
    readonly url: string;
    readonly caption: string;
  };
  public readonly title: string;
  public readonly subtitle: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  public constructor(props: ContentlessArticleDTOProps) {
    this.uid = props.uid;
    this.uploader = props.uploader;
    this.category = props.category;
    this.thumbnail = {
      url: props.thumbnail.url,
      caption: props.thumbnail.caption,
    };
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
