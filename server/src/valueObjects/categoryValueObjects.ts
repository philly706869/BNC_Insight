import { env } from "@/env";

const metadata = env.database.model.category;

export class CategoryNameVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | false = false;
}
export class CategoryName {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex = /^[^\n]*$/;
  static readonly min = metadata.name.min;
  static readonly max = metadata.name.max;

  static verify(value: string): CategoryName | CategoryNameVerifyError {
    let error = false;
    const errorObject = new CategoryNameVerifyError();

    if (!CategoryName.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < CategoryName.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > CategoryName.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new CategoryName(value);
  }
}
