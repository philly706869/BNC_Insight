import { env } from "@/env";

export namespace CategoryValue {
  const config = env.category;

  export class Name {
    private static readonly regex = /^[^\n]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | null {
      if (!this.regex.test(value)) return null;
      if (value.length < 1) return null;
      if (value.length > config.maxNameLength) return null;
      return new Name(value);
    }
  }
}
