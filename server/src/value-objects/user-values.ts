import { config } from "@/config";
import { ValueObjectVerifyResult } from "@/types/value-object-verify-result";
import { BCRYPT_MAX_BYTE_LENGTH } from "@/utils/bcrypt-constants";

export namespace UserValue {
  const conf = config.user;

  export class Username {
    private static readonly regex = /^[a-z\d]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Username> {
      if (!this.regex.test(value)) {
        return {
          valid: false,
          message: "Username can only contain letters and numbers",
        };
      }
      if (value.length < 1) {
        return { valid: false, message: "Username cannot be empty" };
      }
      if (value.length > conf.maxUsernameLength) {
        return {
          valid: false,
          message: `Username cannot be greater than ${conf.maxUsernameLength} characters`,
        };
      }
      return { valid: true, data: new Username(value) };
    }
  }

  export class Password {
    private static readonly regex =
      /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Password> {
      if (!this.regex.test(value)) {
        return {
          valid: false,
          message:
            "Password can only contain letters, numbers, and common punctuation characters",
        };
      }
      if (value.length < conf.minPasswordLength) {
        return {
          valid: false,
          message: `Password cannot be shorter than ${conf.minPasswordLength} characters`,
        };
      }
      if (value.length > conf.maxPasswordLength) {
        return {
          valid: false,
          message: `Password cannot be greater than ${conf.maxPasswordLength} characters`,
        };
      }
      if (Buffer.byteLength(value) > BCRYPT_MAX_BYTE_LENGTH) {
        return {
          valid: false,
          message: `Password cannot be greater than ${BCRYPT_MAX_BYTE_LENGTH} bytes`,
        };
      }
      return { valid: true, data: new Password(value) };
    }
  }

  export class Name {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Name> {
      if (value.includes("\n")) {
        return { valid: false, message: "Name cannot contain line breaks" };
      }
      if (value.length < 1) {
        return { valid: false, message: "Name cannot be empty" };
      }
      if (value.length > conf.maxNameLength) {
        return {
          valid: false,
          message: `Name cannot be greater than ${conf.maxNameLength} characters`,
        };
      }
      return { valid: true, data: new Name(value) };
    }
  }
}
