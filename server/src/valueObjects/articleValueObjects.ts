import { env } from "@/env";

const metadata = env.database.model.article;

export class ArticleTitleVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | false = false;
}
export class ArticleTitle {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex = /^[^\n]*$/;
  static readonly min = metadata.title.min;
  static readonly max = metadata.title.max;

  static verify(value: string): ArticleTitle | ArticleTitleVerifyError {
    let error = false;
    const errorObject = new ArticleTitleVerifyError();

    if (!ArticleTitle.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < ArticleTitle.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > ArticleTitle.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new ArticleTitle(value);
  }
}

export class ArticleSubtitleVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | false = false;
}
export class ArticleSubtitle {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex = /^[^\n]*$/;
  static readonly min = metadata.subtitle.min;
  static readonly max = metadata.subtitle.max;

  static verify(value: string): ArticleSubtitle | ArticleSubtitleVerifyError {
    let error = false;
    const errorObject = new ArticleSubtitleVerifyError();

    if (!ArticleSubtitle.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < ArticleSubtitle.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > ArticleSubtitle.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new ArticleSubtitle(value);
  }
}
