import { ArticleValue } from "@/database/values/article-values";
import { z } from "zod";

export namespace ArticleValueTransformer {
  export const thumbnailUrl = (arg: string, ctx: z.RefinementCtx) => {
    const thumbnailUrl = ArticleValue.ThumbnailUrl.verify(arg);
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const thumbnailCaption = (arg: string, ctx: z.RefinementCtx) => {
    const thumbnailCaption = ArticleValue.ThumbnailCaption.verify(arg);
    if (thumbnailCaption) {
      return thumbnailCaption;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const title = (arg: string, ctx: z.RefinementCtx) => {
    const title = ArticleValue.Title.verify(arg);
    if (title) {
      return title;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const subtitle = (arg: string, ctx: z.RefinementCtx) => {
    const subtitle = ArticleValue.Subtitle.verify(arg);
    if (subtitle) {
      return subtitle;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const content = (arg: string, ctx: z.RefinementCtx) => {
    const content = ArticleValue.Content.verify(arg);
    if (content) {
      return content;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };
}
