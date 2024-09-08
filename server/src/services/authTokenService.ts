import { AuthToken } from "@/database/models/AuthToken";
import { authTokenRepository } from "@/database/repositories";
import { AuthTokenToken } from "@/valueObjects/authTokenValueObjects";

export async function findAuthToken(
  token: AuthTokenToken
): Promise<AuthToken | null> {
  return await authTokenRepository.findOne({
    where: { token: token.value },
  });
}
