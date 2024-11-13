import { InvalidImageSizeError } from "@errors/service-errors";
import { ArticleServiceOptions } from "@services/api/article-service";
import { ImageServiceOptions } from "@services/cdn/image-service";
import { BCRYPT_MAX_BYTE_LENGTH } from "@utils/bcrypt-constants";
import { StringConstraint, stringConstraints } from "@utils/constraint";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import validator, { IsURLOptions } from "validator";

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
    readonly thumbnailUrlConstraints: StringConstraint;
    readonly thumbnailCaptionConstraints: StringConstraint;
    readonly titleConstraints: StringConstraint;
    readonly subtitleConstraints: StringConstraint;
    readonly contentDeltaConstraints: StringConstraint;
  } & ArticleServiceOptions;

  readonly thumbnail: {
    readonly tempPath: string;
    readonly maxBytes: number;
    readonly rateLimit: number;
    readonly rateWindow: number;
  } & ImageServiceOptions;

  readonly image: {
    readonly tempPath: string;
    readonly maxBytes: number;
    readonly rateLimit: number;
    readonly rateWindow: number;
  } & ImageServiceOptions;
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
    defaultThumbnailURL: new URL("about:blank"),
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
    uploadPath: path.resolve("./uplaods/thumbnails"),
    maxBytes: 4 * 1024 * 1024 /* =4MB */,
    rateLimit: 10,
    rateWindow: 60 * 1000 /* =1min */,
    supportedFormats: ["webp"],
    async imageProcessor(sharp, metadata) {
      if (metadata.width !== 1280 || metadata.height !== 720) {
        return Promise.reject(new InvalidImageSizeError());
      }

      const name = `${uuidv4()}.webp`;
      const data = sharp.webp({
        lossless: true,
        force: true,
      });
      return { name, data };
    },
  },

  image: {
    tempPath: path.resolve("./uploads/tmp"),
    uploadPath: path.resolve("./uploads/images"),
    maxBytes: 4 * 1024 * 1024 /* =4MB */,
    rateLimit: 10,
    rateWindow: 60 * 1000 /* =1min */,
    supportedFormats: ["webp"],
    async imageProcessor(sharp) {
      const name = `${uuidv4()}.webp`;
      const data = sharp.webp({
        lossless: true,
        force: true,
      });
      return { name, data };
    },
  },
} as const satisfies Config;
