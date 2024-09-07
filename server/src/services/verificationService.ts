import { env } from "@/env";
import { BCRYPT_MAX_BYTE_LENGTH } from "@/utils/const";

const modelMeta = env.database.model;

export type VerificationResult<ErrorCode extends string> =
  | {
      error: false;
    }
  | {
      error: true;
      errorCode: ErrorCode;
    };

export type LengthErrorCode = "MIN_LENGTH_VIOLATION" | "MAX_LENGTH_VIOLATION";
export type ByteLengthErrorCode = "MAX_BYTE_LENGTH_VIOLATION";
export type CharacterErrorCode = "INCLUDES_ILLEGAL_CHARACTER";

export type AuthTokenVerificationErrorCode = LengthErrorCode;
export function verifyAuthTokenFormat(
  value: string
): VerificationResult<AuthTokenVerificationErrorCode> {
  const { min, max } = modelMeta.authToken.token;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}

export type UserIdVerificationErrorCode = CharacterErrorCode | LengthErrorCode;
const userIdRegex = /^[a-z\d]*$/;
export function verifyUserIdFormat(
  value: string
): VerificationResult<UserIdVerificationErrorCode> {
  if (!userIdRegex.test(value))
    return { error: true, errorCode: "INCLUDES_ILLEGAL_CHARACTER" };
  const { min, max } = modelMeta.user.id;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}

export type UserPasswordVerificationErrorCode =
  | CharacterErrorCode
  | LengthErrorCode
  | ByteLengthErrorCode;
const userPasswordRegex = /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*?$/;
export function verifyUserPasswordFormat(
  value: string
): VerificationResult<UserPasswordVerificationErrorCode> {
  if (!userPasswordRegex.test(value))
    return { error: true, errorCode: "INCLUDES_ILLEGAL_CHARACTER" };
  const { min, max } = modelMeta.user.password;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  if (Buffer.byteLength(value) > BCRYPT_MAX_BYTE_LENGTH)
    return { error: true, errorCode: "MAX_BYTE_LENGTH_VIOLATION" };
  return { error: false };
}

export type UserNameVerificationErrorCode =
  | CharacterErrorCode
  | LengthErrorCode;
const userNameRegex = /^[a-z\d]*?$/;
export function verifyUserNameFormat(
  value: string
): VerificationResult<UserNameVerificationErrorCode> {
  if (!userNameRegex.test(value))
    return { error: true, errorCode: "INCLUDES_ILLEGAL_CHARACTER" };
  const { min, max } = modelMeta.user.name;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}

export type CategoryNameVerificationErrorCode =
  | CharacterErrorCode
  | LengthErrorCode;
export function verifyCategoryNameFormat(
  value: string
): VerificationResult<CategoryNameVerificationErrorCode> {
  if (value.includes("\n"))
    return { error: true, errorCode: "INCLUDES_ILLEGAL_CHARACTER" };
  const { min, max } = modelMeta.category.name;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}

export type ArticleTitleVerificationErrorCode = LengthErrorCode;
export function verifyArticleTitleFormat(
  value: string
): VerificationResult<ArticleTitleVerificationErrorCode> {
  const { min, max } = modelMeta.article.title;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}

export type ArticleSubtitleVerificationErrorCode = LengthErrorCode;
export function verifyArticleSubtitleFormat(
  value: string
): VerificationResult<ArticleSubtitleVerificationErrorCode> {
  const { min, max } = modelMeta.article.subtitle;
  if (value.length < min)
    return { error: true, errorCode: "MIN_LENGTH_VIOLATION" };
  if (value.length > max)
    return { error: true, errorCode: "MAX_LENGTH_VIOLATION" };
  return { error: false };
}
