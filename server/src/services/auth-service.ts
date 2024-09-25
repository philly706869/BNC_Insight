import { dataSource } from "@/database/data-source";
import { AuthToken } from "@/database/entities/auth-token";
import { User } from "@/database/entities/user";
import { authTokenRepository, userRepository } from "@/database/repositories";
import { AuthTokenValue } from "@/database/values/auth-token-values";
import { UserValue } from "@/database/values/user-values";
import { ProtectedUserDTO } from "@/dto/protected-user-dto";
import { compare, hash } from "bcrypt";
import { Session, SessionData } from "express-session";

export class SignupError {
  declare error: string;
  constructor(error: string) {
    this.error = error;
  }
}

export async function signup(
  token: AuthTokenValue.Token,
  username: UserValue.Username,
  password: UserValue.Password,
  name: UserValue.Name
): Promise<ProtectedUserDTO> {
  const authToken = await authTokenRepository.findOne({
    where: { token: token.value },
    select: { token: true, isAdminToken: true },
  });
  if (!authToken) throw new SignupError("Auth token is not valid");

  if (await userRepository.exists({ where: { username: username.value } }))
    throw new SignupError(`${username.value} is already taken.`);

  const user = await dataSource.transaction(async (manager) => {
    await manager.delete(AuthToken, authToken);
    const user = manager.create(User, {
      username: username.value,
      passwordHash: Buffer.from(await hash(password.value, 10)),
      name: name.value,
      isAdmin: authToken.isAdminToken,
    });
    return await manager.save(user);
  });

  return ProtectedUserDTO.from(user);
}

export class SigninError {
  declare error: string;
  constructor(error: string) {
    this.error = error;
  }
}

export async function signin(
  session: Partial<SessionData>,
  username: UserValue.Username,
  password: UserValue.Password
): Promise<ProtectedUserDTO> {
  const user = await userRepository.findOne({
    where: { username: username.value },
    select: { uid: true, passwordHash: true },
  });
  if (!user) throw new SigninError("Invalid username.");

  const isPasswordCorrect = await compare(
    password.value,
    user.passwordHash.toString()
  );
  if (!isPasswordCorrect) throw new SigninError("Invalid password.");

  session.userUid = user.uid;

  return ProtectedUserDTO.from(user);
}

export async function signout(
  session: Session & Partial<SessionData>
): Promise<void> {
  return new Promise((resolve, reject) => {
    session.destroy((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
