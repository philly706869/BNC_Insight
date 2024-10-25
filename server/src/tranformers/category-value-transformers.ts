import { CategoryValue } from "@/value-objects/category-values";
import { z } from "zod";

export namespace CategoryValueTransformer {
  export const name = (
    arg: string,
    ctx: z.RefinementCtx
  ): CategoryValue.Name => {
    const name = CategoryValue.Name.verify(arg);
    if (name === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return name;
  };
}
