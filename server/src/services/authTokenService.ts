import { AuthToken } from "@/database/models/AuthToken";
import { authTokenRepository } from "@/database/repositories";
import { AuthTokenToken } from "@/valueObjects/authTokenValueObjects";

export async function getAuthToken(
  token: AuthTokenToken
): Promise<AuthToken | null> {
  return await authTokenRepository.findOne({
    where: { token: token.value },
  });
}

export async function createAuthToken(
  token: AuthTokenToken
): Promise<AuthToken> {}
