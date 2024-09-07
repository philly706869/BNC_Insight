import { AuthToken } from "@/models/AuthToken";
import {
  AuthTokenVerificationErrorCode,
  verifyAuthTokenFormat,
} from "./verificationService";

export class AuthTokenFindException {
  declare errorCode: AuthTokenVerificationErrorCode;
  constructor(errorCode: AuthTokenVerificationErrorCode) {
    this.errorCode = errorCode;
  }
}

export async function findAuthToken(token: string): Promise<AuthToken | null> {
  const authTokenVerificationResult = verifyAuthTokenFormat(token);
  if (authTokenVerificationResult.error)
    throw new AuthTokenFindException(authTokenVerificationResult.errorCode);
  return await AuthToken.findOne({
    where: { token },
  });
}
