import { env } from "@/env";

const metadata = env.database.model.authToken;

export class AuthTokenTokenVerifyError {
  lengthLimitViolation: "min" | "max" | false = false;
}
export class AuthTokenToken {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static readonly min = metadata.token.min;
  static readonly max = metadata.token.max;

  static verify(value: string): AuthTokenToken | AuthTokenTokenVerifyError {
    let error = false;
    const errorObject = new AuthTokenTokenVerifyError();

    if (value.length < AuthTokenToken.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > AuthTokenToken.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new AuthTokenToken(value);
  }
}
