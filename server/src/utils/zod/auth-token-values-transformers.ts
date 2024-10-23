import { AuthTokenValue } from "@/database/values/auth-token-values";
import { z } from "zod";

export namespace AuthTokenValueTransformer {
  export const token = (arg: string, ctx: z.RefinementCtx) => {
    const token = AuthTokenValue.Token.verify(arg);
    if (token) {
      return token;
    }
    ctx.addIssue({ code: "custom" });
    return z.NEVER;
  };
}
