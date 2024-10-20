import { config } from "@/config";

export namespace CategoryValue {
  const conf = config.category;

  export class Name {
    private static readonly regex = /^[^\n]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | null {
      if (!this.regex.test(value)) return null;
      if (value.length < 1) return null;
      if (value.length > conf.maxNameLength) return null;
      return new Name(value);
    }
  }
}
