import { AuthTokenValue } from "@/value-objects/auth-token-values";
import { z } from "zod";

export namespace AuthTokenValueTransformer {
  export const token = (
    arg: string,
    ctx: z.RefinementCtx
  ): AuthTokenValue.Token => {
    const token = AuthTokenValue.Token.verify(arg);
    if (token === null) {
      ctx.addIssue({ code: "custom" });
      return z.NEVER;
    }
    return token;
  };
}
