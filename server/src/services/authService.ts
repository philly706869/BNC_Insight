import { User } from "@/database/models/User";
import { authTokenRepository, userRepository } from "@/database/repositories";
import {
  AuthTokenToken,
  AuthTokenTokenVerifyError,
} from "@/valueObjects/authTokenValueObjects";
import {
  UserName,
  UserNameVerifyError,
  UserPassword,
  UserPasswordVerifyError,
  UserUsername,
  UserUsernameVerifyError,
} from "@/valueObjects/userValueObjects";
import { compare, hash } from "bcrypt";
import { Session, SessionData } from "express-session";
import { getAuthToken } from "./authTokenService";
import { getUserByUsername } from "./userService";

export type SignupErrorCodes =
  | "USERNAME_EXISTS"
  | "INVALID_AUTH_TOKEN"
  | "INVALID_USERNAME"
  | "INVALID_PASSWORD"
  | "INVALID_NAME";

export class SignupError {
  declare errorCode: SignupErrorCodes;
  constructor(errorCode: SignupErrorCodes) {
    this.errorCode = errorCode;
  }
}

export async function signup(
  token: string,
  username: string,
  password: string,
  name: string,
  isAdmin: boolean = false
): Promise<User> {
  const authTokenToken = AuthTokenToken.verify(token);
  if (authTokenToken instanceof AuthTokenTokenVerifyError)
    throw new SignupError("INVALID_AUTH_TOKEN");
  const authToken = await getAuthToken(authTokenToken);
  if (!authToken) throw new SignupError("INVALID_AUTH_TOKEN");

  const userUsername = UserUsername.verify(username);
  if (userUsername instanceof UserUsernameVerifyError)
    throw new SignupError("INVALID_USERNAME");
  if (await getUserByUsername(userUsername))
    throw new SignupError("USERNAME_EXISTS");

  const userPassword = UserPassword.verify(password);
  if (userPassword instanceof UserPasswordVerifyError)
    throw new SignupError("INVALID_PASSWORD");

  const userName = UserName.verify(name);
  if (userName instanceof UserNameVerifyError)
    throw new SignupError("INVALID_NAME");

  await authTokenRepository.remove(authToken);
  const user = new User();
  user.username = username;
  user.passwordHash = Buffer.from(await hash(password, 10));
  user.name = name;
  user.isAdmin = isAdmin;
  return await userRepository.save(user);
}

export type SigninErrorCodes = "INVALID_USERNAME" | "INVALID_PASSWORD";

export class SigninError {
  declare errorCode: SigninErrorCodes;
  constructor(error: SigninErrorCodes) {
    this.errorCode = error;
  }
}

export async function signin(
  session: Partial<SessionData>,
  username: string,
  password: string
): Promise<User> {
  const userUsername = UserUsername.verify(username);
  if (userUsername instanceof UserUsernameVerifyError)
    throw new SigninError("INVALID_USERNAME");
  const user = await getUserByUsername(userUsername);
  if (!user) throw new SigninError("INVALID_USERNAME");

  const userPassword = UserPassword.verify(password);
  if (userPassword instanceof UserPasswordVerifyError)
    throw new SigninError("INVALID_PASSWORD");
  const isPasswordCorrect = await compare(
    userPassword.value,
    user.passwordHash.toString()
  );
  if (!isPasswordCorrect) throw new SigninError("INVALID_PASSWORD");

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
