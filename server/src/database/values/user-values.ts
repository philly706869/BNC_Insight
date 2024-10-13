import { env } from "@/env";
import { BCRYPT_MAX_BYTE_LENGTH } from "@/utils/constants";

export namespace UserValue {
  const metadata = env.user;

  export class Username {
    private static readonly regex = /^[a-z\d]*$/;
    public static readonly min = metadata.username.min;
    public static readonly max = metadata.username.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Username | null {
      const { regex, min, max } = Username;
      if (!regex.test(value)) return null;
      if (value.length < min) return null;
      if (value.length > max) return null;
      return new Username(value);
    }
  }

  export class Password {
    private static readonly regex =
      /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/;
    public static readonly min = metadata.password.min;
    public static readonly max = metadata.password.max;
    public static readonly byteMax = BCRYPT_MAX_BYTE_LENGTH;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Password | null {
      const { regex, min, max, byteMax } = Password;
      if (!regex.test(value)) return null;
      if (value.length < min) return null;
      if (value.length > max) return null;
      if (Buffer.byteLength(value) > byteMax) return null;
      return new Password(value);
    }
  }

  export class Name {
    private static readonly regex = /^[a-z\d]*$/;
    public static readonly min = metadata.name.min;
    public static readonly max = metadata.name.max;

    private constructor(public readonly value: string) {}

    public static verify(value: string): Name | null {
      const { regex, min, max } = Name;
      if (!regex.test(value)) return null;
      if (value.length < min) return null;
      if (value.length > max) return null;
      return new Name(value);
    }
  }
}
