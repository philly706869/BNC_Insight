import { UserValue } from "@/database/values/user-values";
import { z } from "zod";

export namespace UserValueTransformer {
  export const username = (
    arg: string,
    ctx: z.RefinementCtx
  ): UserValue.Username => {
    const username = UserValue.Username.verify(arg);
    if (username === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return username;
  };

  export const password = (
    arg: string,
    ctx: z.RefinementCtx
  ): UserValue.Password => {
    const password = UserValue.Password.verify(arg);
    if (password === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return password;
  };

  export const name = (arg: string, ctx: z.RefinementCtx): UserValue.Name => {
    const name = UserValue.Name.verify(arg);
    if (name === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return name;
  };
}
