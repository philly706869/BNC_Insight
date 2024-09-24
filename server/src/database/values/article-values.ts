import { env } from "@/env";
import validator, { IsURLOptions } from "validator";

export namespace ArticleValue {
  const metadata = env.database.model.article;

  export class ThumbnailUrl {
    private static readonly isUrlOptions: IsURLOptions = {
      protocols: ["http", "https"],
    };
    public static readonly max = metadata.thumbnailUrl.max;

    private constructor(public value: string) {}

    public static verify(value: string): ThumbnailUrl | null {
      const { isUrlOptions, max } = ThumbnailUrl;
      if (!validator.isURL(value, isUrlOptions)) return null;
      if (value.length > max) return null;
      return new ThumbnailUrl(value);
    }
  }

  export class Title {
    private static readonly regex = /^[^\n]*$/;
    public static readonly min = metadata.title.min;
    public static readonly max = metadata.title.max;

    private constructor(public value: string) {}

    public static verify(value: string): Title | null {
      const { regex, min, max } = Title;
      if (!regex.test(value)) return null;
      if (value.length < min) return null;
      if (value.length > max) return null;
      return new Title(value);
    }
  }

  export class Subtitle {
    private static readonly regex = /^[^\n]*$/;
    public static readonly min = metadata.subtitle.min;
    public static readonly max = metadata.subtitle.max;

    private constructor(public value: string) {}

    public static verify(value: string): Title | null {
      const { regex, min, max } = Subtitle;
      if (!regex.test(value)) return null;
      if (value.length < min) return null;
      if (value.length > max) return null;
      return new Subtitle(value);
    }
  }

  export class Content {
    private constructor(public value: any) {}

    public static verify(value: any): Content | null {
      return new Content(value);
    }
  }
}
