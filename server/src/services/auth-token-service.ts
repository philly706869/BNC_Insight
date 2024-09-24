import { AuthToken } from "@/database/entities/AuthToken";
import { authTokenRepository } from "@/database/repositories";

export async function findAuthToken(token: string): Promise<AuthToken | null> {
  return await authTokenRepository.findOne({
    where: { token },
  });
}

export async function createAuthToken(token: string): Promise<AuthToken> {
  throw {};
}
