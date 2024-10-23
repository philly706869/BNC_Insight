import { UserValue } from "@/database/values/user-values";
import { z } from "zod";

export namespace UserValueTransformer {
  export const username = (arg: string, ctx: z.RefinementCtx) => {
    const username = UserValue.Username.verify(arg);
    if (username) {
      return username;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const password = (arg: string, ctx: z.RefinementCtx) => {
    const password = UserValue.Password.verify(arg);
    if (password) {
      return password;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };

  export const name = (arg: string, ctx: z.RefinementCtx) => {
    const name = UserValue.Name.verify(arg);
    if (name) {
      return name;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };
}
