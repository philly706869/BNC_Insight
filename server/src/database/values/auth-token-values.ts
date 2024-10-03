import { env } from "@/env";

export namespace AuthTokenValue {
  const metadata = env.database.config.authToken;

  export class Token {
    public static readonly min = metadata.token.min;
    public static readonly max = metadata.token.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Token | null {
      const { min, max } = Token;
      if (value.length < min) return null;
      if (value.length > max) return null;
      return new Token(value);
    }
  }
}
