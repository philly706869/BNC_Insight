import { config } from "@/config";
import { ValueObjectVerifyResult } from "@/types/value-object-verify-result";

export namespace CategoryValue {
  const conf = config.category;

  export class Name {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Name> {
      if (value.includes("\n")) {
        return {
          valid: false,
          message: "Category name cannot contain line breaks",
        };
      }
      if (value.length < 1) {
        return { valid: false, message: "Category name be empty" };
      }
      if (value.length > conf.maxNameLength) {
        return {
          valid: false,
          message: `Category name be greater than ${conf.maxNameLength} characters`,
        };
      }
      return { valid: true, data: new Name(value) };
    }
  }
}
