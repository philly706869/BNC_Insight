import { env } from "@/env";

export namespace AuthTokenValue {
  const config = env.authToken;

  export class Token {
    private constructor(public readonly value: string) {}

    public static verify(value: string): Token | null {
      if (value.length < 1) return null;
      if (value.length > config.maxTokenLength) return null;
      return new Token(value);
    }
  }
}
