import { config } from "@/config";
import { BCRYPT_MAX_BYTE_LENGTH } from "@/utils/constants";

export namespace UserValue {
  const conf = config.user;

  export class Username {
    private static readonly regex = /^[a-z\d]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Username | null {
      if (!this.regex.test(value)) return null;
      if (value.length < 1) return null;
      if (value.length > conf.maxUsernameLength) return null;
      return new Username(value);
    }
  }

  export class Password {
    private static readonly regex =
      /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Password | null {
      if (!this.regex.test(value)) return null;
      if (value.length < conf.minPasswordLength) return null;
      if (value.length > conf.maxPasswordLength) return null;
      if (Buffer.byteLength(value) > BCRYPT_MAX_BYTE_LENGTH) return null;
      return new Password(value);
    }
  }

  export class Name {
    private static readonly regex = /^[a-z\d]*$/;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | null {
      if (!this.regex.test(value)) return null;
      if (value.length < 1) return null;
      if (value.length > conf.maxNameLength) return null;
      return new Name(value);
    }
  }
}
