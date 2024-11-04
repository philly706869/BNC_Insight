import { config } from "@/config";
import { ValueObjectVerifyResult } from "@/types/value-object-verify-result";

export namespace ArticleValue {
  const conf = config.article;

  export class ThumbnailUrl {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<ThumbnailUrl> {
      const { success, message } = conf.thumbnailUrlConstraints.check(value);
      return success
        ? {
            success,
            data: new ThumbnailUrl(value),
          }
        : { success, message };
    }
  }

  export class ThumbnailCaption {
    private constructor(public readonly value: string) {}

    public static verify(
      value: string
    ): ValueObjectVerifyResult<ThumbnailCaption> {
      const { success, message } =
        conf.thumbnailCaptionConstraints.check(value);
      return success
        ? {
            success,
            data: new ThumbnailCaption(value),
          }
        : { success, message };
    }
  }

  export class Title {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Title> {
      const { success, message } = conf.titleConstraints.check(value);
      return success
        ? {
            success,
            data: new Title(value),
          }
        : { success, message };
    }
  }

  export class Subtitle {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Subtitle> {
      const { success, message } = conf.subtitleConstraints.check(value);
      return success
        ? {
            success,
            data: new Subtitle(value),
          }
        : { success, message };
    }
  }

  export class Content {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Content> {
      const { success, message } = conf.contentDeltaConstraints.check(value);
      return success
        ? {
            success,
            data: new Content(value),
          }
        : { success, message };
    }
  }
}
