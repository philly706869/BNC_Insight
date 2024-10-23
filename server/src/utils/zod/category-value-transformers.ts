import { CategoryValue } from "@/database/values/category-values";
import { z } from "zod";

export namespace CategoryValueTransformer {
  export const name = (arg: string, ctx: z.RefinementCtx) => {
    const name = CategoryValue.Name.verify(arg);
    if (name) {
      return name;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };
}
