import path from "path";
import sharp from "sharp";
import validator, { IsURLOptions } from "validator";
import { BCRYPT_MAX_BYTE_LENGTH } from "./utils/bcrypt-constants";
import { StringConstraint, stringConstraints } from "./utils/constraint";

export type Config = {
  readonly authToken: {
    readonly tokenContraints: StringConstraint;
  };

  readonly user: {
    readonly usernameConstraints: StringConstraint;
    readonly passwordConstraints: StringConstraint;
    readonly nameConstraints: StringConstraint;
    readonly passwordHashRounds: number;
  };

  readonly category: {
    readonly nameConstraints: StringConstraint;
  };

  readonly article: {
    readonly defaultQueryLimit: number;
    readonly maxQueryLimit: number;
    readonly defaultThumbnailUrl: string;
    readonly thumbnailUrlConstraints: StringConstraint;
    readonly thumbnailCaptionConstraints: StringConstraint;
    readonly titleConstraints: StringConstraint;
    readonly subtitleConstraints: StringConstraint;
    readonly contentDeltaConstraints: StringConstraint;
  };

  readonly thumbnail: {
    readonly tempPath: string;
    readonly path: string;
    readonly width: number;
    readonly height: number;
    readonly maxBytes: number;
    readonly supportedFormats: string[];
    readonly saveFormat: keyof sharp.FormatEnum;
  };

  readonly image: {
    readonly tempPath: string;
    readonly path: string;
    readonly maxBytes: number;
    readonly supportedFormats: string[];
    readonly saveFormat: keyof sharp.FormatEnum;
  };
};

export const config = {
  authToken: {
    tokenContraints: stringConstraints([
      {
        min: 1,
        message: "Token cannot be empty",
      },
      {
        max: 128,
        message: "Token cannot be greater than 128 characters",
      },
    ]),
  },

  user: {
    usernameConstraints: stringConstraints([
      {
        min: 1,
        message: "Username cannot be empty",
      },
      {
        max: 32,
        message: "Username cannot be greater than 32 characters",
      },
      {
        pattern: /^[a-z\d]*$/,
        message: "Username can only contain letters and numbers",
      },
    ]),
    passwordConstraints: stringConstraints([
      {
        min: 8,
        message: "Password cannot be shorter than 8 characters",
      },
      {
        max: 72,
        message: "Password cannot be greater than 72 characters",
      },
      {
        pattern: /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/,
        message:
          "Password can only contain letters, numbers, and common punctuation characters",
      },
      {
        // important
        validator: (value) =>
          Buffer.byteLength(value) <= BCRYPT_MAX_BYTE_LENGTH,
        message: `Password cannot be greater than ${BCRYPT_MAX_BYTE_LENGTH} bytes`,
      },
    ]),
    nameConstraints: stringConstraints([
      {
        min: 1,
        message: "Name cannot be empty",
      },
      {
        max: 16,
        message: "Name cannot be greater than 16 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Name cannot contain line breaks",
      },
    ]),
    passwordHashRounds: 10,
  },

  category: {
    nameConstraints: stringConstraints([
      {
        min: 1,
        message: "Category name be empty",
      },
      {
        max: 16,
        message: "Category name be greater than 16 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Category name cannot contain line breaks",
      },
    ]),
  },

  article: {
    defaultQueryLimit: 30,
    maxQueryLimit: 30,
    defaultThumbnailUrl: "",
    thumbnailUrlConstraints: stringConstraints([
      {
        max: 2048,
        message: "Thumbnail url cannot be greater than 2048 characters",
      },
      {
        validator: (() => {
          const options: IsURLOptions = { protocols: ["http", "https"] };
          return (value) => validator.isURL(value, options);
        })(),
        message: "Thumbnail url is not valid",
      },
    ]),
    thumbnailCaptionConstraints: stringConstraints([
      {
        max: 64,
        message: "Thumbnail caption cannot be greater than 64 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Thumbnail caption cannot contain line breaks",
      },
    ]),
    titleConstraints: stringConstraints([
      {
        min: 1,
        message: "Title cannot be empty",
      },
      {
        max: 64,
        message: "Title cannot be greater than 64 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Title cannot contain line breaks",
      },
    ]),
    subtitleConstraints: stringConstraints([
      {
        max: 128,
        message: "Subtitle cannot be greater than 128 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Subtitle cannot contain line breaks",
      },
    ]),
    contentDeltaConstraints: stringConstraints([
      {
        max: 10000,
        message: "Content is too long",
      },
    ]),
  },

  thumbnail: {
    tempPath: path.resolve("./uploads/tmp"),
    path: path.resolve("./uplaods/thumbnails"),
    width: 1280,
    height: 720,
    maxBytes: 4 * 1024 * 1024 /* 4MB */,
    supportedFormats: ["jpeg", "png", "webp"],
    saveFormat: "jpeg",
  },

  image: {
    tempPath: path.resolve("./uploads/tmp"),
    path: path.resolve("./uploads/images"),
    maxBytes: 4 * 1024 * 1024 /* 4MB */,
    supportedFormats: ["jpeg", "png", "webp"],
    saveFormat: "jpeg",
  },
} as const satisfies Config;
