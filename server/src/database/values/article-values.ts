import { env } from "@/env";
import validator, { IsURLOptions } from "validator";

export namespace ArticleValue {
  const config = env.article;

  export class ThumbnailUrl {
    private static readonly isURLOptions: IsURLOptions = {
      protocols: ["http", "https"],
    };

    private constructor(public readonly value: string) {}

    public static verify(value: string): ThumbnailUrl | null {
      if (!validator.isURL(value, this.isURLOptions)) return null;
      if (value.length > config.maxThumbnailUrlLength) return null;
      return new ThumbnailUrl(value);
    }
  }

  export class ThumbnailCaption {
    private static readonly regex = /^[^\n]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): ThumbnailCaption | null {
      if (!this.regex.test(value)) return null;
      if (value.length > config.maxThumbnailCaptionLength) return null;
      return new ThumbnailCaption(value);
    }
  }

  export class Title {
    private static readonly regex = /^[^\n]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Title | null {
      if (!this.regex.test(value)) return null;
      if (value.length < 1) return null;
      if (value.length > config.maxTitleLength) return null;
      return new Title(value);
    }
  }

  export class Subtitle {
    private static readonly regex = /^[^\n]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Title | null {
      if (!this.regex.test(value)) return null;
      if (value.length > config.maxSubtitleLength) return null;
      return new Subtitle(value);
    }
  }

  export class Content {
    private constructor(public readonly value: any) {}

    public static verify(value: string): Content | null {
      if (value.length > config.maxContentDeltaLength) return null;
      return new Content(value);
    }
  }
}
