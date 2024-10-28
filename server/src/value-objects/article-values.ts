import { config } from "@/config";
import { ValueObjectVerifyResult } from "@/types/value-object-verify-result";
import validator, { IsURLOptions } from "validator";

export namespace ArticleValue {
  const conf = config.article;

  export class ThumbnailUrl {
    private static readonly isURLOptions: IsURLOptions = {
      protocols: ["http", "https"],
    };

    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<ThumbnailUrl> {
      if (!validator.isURL(value, this.isURLOptions)) {
        return { valid: false, message: "Thumbnail url is not valid" };
      }
      if (value.length > conf.maxThumbnailUrlLength) {
        return {
          valid: false,
          message: `Thumbnail url cannot be greater than ${conf.maxThumbnailUrlLength} characters`,
        };
      }
      return { valid: true, data: new ThumbnailUrl(value) };
    }
  }

  export class ThumbnailCaption {
    private constructor(public readonly value: string) {}

    public static verify(
      value: string
    ): ValueObjectVerifyResult<ThumbnailCaption> {
      if (value.includes("\n")) {
        return {
          valid: false,
          message: "Thumbnail caption cannot contain line breaks",
        };
      }
      if (value.length > conf.maxThumbnailCaptionLength) {
        return {
          valid: false,
          message: `Thumbnail caption cannot be greater than ${conf.maxThumbnailCaptionLength} characters`,
        };
      }
      return { valid: true, data: new ThumbnailCaption(value) };
    }
  }

  export class Title {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Title> {
      if (value.includes("\n")) {
        return { valid: false, message: "Title cannot contain line breaks" };
      }
      if (value.length < 1) {
        return { valid: false, message: "Title cannot be empty" };
      }
      if (value.length > conf.maxTitleLength) {
        return {
          valid: false,
          message: `Title cannot be greater than ${conf.maxTitleLength} characters`,
        };
      }
      return { valid: true, data: new Title(value) };
    }
  }

  export class Subtitle {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Subtitle> {
      if (value.includes("\n")) {
        return { valid: false, message: "Subtitle cannot contain line breaks" };
      }
      if (value.length > conf.maxSubtitleLength) {
        return {
          valid: false,
          message: `Subtitle cannot be greater than ${conf.maxSubtitleLength} characters`,
        };
      }
      return { valid: true, data: new Subtitle(value) };
    }
  }

  export class Content {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Content> {
      if (value.length > conf.maxContentDeltaLength) {
        return { valid: false, message: "Content is too long" };
      }
      return { valid: true, data: new Content(value) };
    }
  }
}
