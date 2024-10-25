import { ArticleValue } from "@/value-objects/article-values";
import { z } from "zod";

export namespace ArticleValueTransformer {
  export const thumbnailUrl = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.ThumbnailUrl => {
    const thumbnailUrl = ArticleValue.ThumbnailUrl.verify(arg);
    if (thumbnailUrl === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return thumbnailUrl;
  };

  export const thumbnailCaption = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.ThumbnailCaption => {
    const thumbnailCaption = ArticleValue.ThumbnailCaption.verify(arg);
    if (thumbnailCaption === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return thumbnailCaption;
  };

  export const title = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Title => {
    const title = ArticleValue.Title.verify(arg);
    if (title === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return title;
  };

  export const subtitle = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Subtitle => {
    const subtitle = ArticleValue.Subtitle.verify(arg);
    if (subtitle === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return subtitle;
  };

  export const content = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Content => {
    const content = ArticleValue.Content.verify(arg);
    if (content === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return content;
  };
}
