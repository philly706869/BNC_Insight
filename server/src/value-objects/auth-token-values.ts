import { config } from "@/config";

export namespace AuthTokenValue {
  const conf = config.authToken;

  export class Token {
    private constructor(public readonly value: string) {}

    public static verify(value: string): Token | null {
      if (value.length < 1) {
        return null;
      }
      if (value.length > conf.maxTokenLength) {
        return null;
      }
      return new Token(value);
    }
  }
}
