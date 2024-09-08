import { env } from "@/env";
import { BCRYPT_MAX_BYTE_LENGTH } from "@/utils/const";

const metadata = env.database.model.user;

export class UserUsernameVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | false = false;
}
export class UserUsername {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex = /^[a-z\d]*$/;
  static readonly min = metadata.username.min;
  static readonly max = metadata.username.max;

  static verify(value: string): UserUsername | UserUsernameVerifyError {
    let error = false;
    const errorObject = new UserUsernameVerifyError();

    if (!UserUsername.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < UserUsername.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > UserUsername.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new UserUsername(value);
  }
}

export class UserPasswordVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | "bytemax" | false = false;
}
export class UserPassword {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex =
    /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;
  static readonly min = metadata.password.min;
  static readonly max = metadata.password.max;
  static readonly byteMax = BCRYPT_MAX_BYTE_LENGTH;

  static verify(value: string): UserPassword | UserPasswordVerifyError {
    let error = false;
    const errorObject = new UserPasswordVerifyError();

    if (!UserPassword.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < UserPassword.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > UserPassword.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    } else if (Buffer.byteLength(value) > UserPassword.byteMax) {
      error = true;
      errorObject.lengthLimitViolation = "bytemax";
    }

    if (error) return errorObject;
    return new UserPassword(value);
  }
}

export class UserNameVerifyError {
  hasInvalidCharacter: boolean = false;
  lengthLimitViolation: "min" | "max" | false = false;
}
export class UserName {
  declare readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static readonly regex = /^[a-z\d]*$/;
  static readonly min = metadata.name.min;
  static readonly max = metadata.name.max;

  static verify(value: string): UserName | UserNameVerifyError {
    let error = false;
    const errorObject = new UserNameVerifyError();

    if (!UserName.regex.test(value)) {
      error = true;
      errorObject.hasInvalidCharacter = true;
    }

    if (value.length < UserUsername.min) {
      error = true;
      errorObject.lengthLimitViolation = "min";
    } else if (value.length > UserUsername.max) {
      error = true;
      errorObject.lengthLimitViolation = "max";
    }

    if (error) return errorObject;
    return new UserName(value);
  }
}
