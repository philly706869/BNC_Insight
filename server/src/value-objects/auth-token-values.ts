import { config } from "@/config";
import { ValueObjectVerifyResult } from "@/types/value-object-verify-result";

export namespace AuthTokenValue {
  const conf = config.authToken;

  export class Token {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Token> {
      const invalid = {
        valid: false,
        message: "Auth token is not valid",
      } as const;
      if (value.length < 1) {
        return invalid;
      }
      if (value.length > conf.maxTokenLength) {
        return invalid;
      }
      return { valid: true, data: new Token(value) };
    }
  }
}
