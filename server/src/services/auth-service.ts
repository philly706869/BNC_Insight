import { dataSource } from "@/database/data-source";
import { AuthToken } from "@/database/entities/auth-token";
import { User } from "@/database/entities/user";
import { AuthTokenValue } from "@/database/values/auth-token-values";
import { UserValue } from "@/database/values/user-values";
import { compare, hash } from "bcrypt";
import { Session, SessionData } from "express-session";
import { findAuthToken } from "./auth-token-service";
import { findUserByUsername } from "./user-service";

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
  name: UserValue.Name,
  isAdmin: boolean = false
): Promise<User> {
  const authToken = await findAuthToken(token.value);
  if (!authToken) throw new SignupError("Auth token is not valid");

  if (await findUserByUsername(username.value))
    throw new SignupError(`${username.value} is already taken.`);

  return await dataSource.transaction(async (manager) => {
    await manager.delete(AuthToken, authToken);
    const user = manager.create(User, {
      username: username.value,
      passwordHash: Buffer.from(await hash(password.value, 10)),
      name: name.value,
      isAdmin,
    });
    return await manager.save(user);
  });
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
): Promise<User> {
  const user = await findUserByUsername(username.value);
  if (!user) throw new SigninError("Invalid username.");

  const isPasswordCorrect = await compare(
    password.value,
    user.passwordHash.toString()
  );
  if (!isPasswordCorrect) throw new SigninError("Invalid password.");

  session.userUid = user.uid;

  return user;
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
