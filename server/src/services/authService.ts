import { AuthToken } from "@/database/models/AuthToken";
import { User } from "@/database/models/User";
import { authTokenRepository, userRepository } from "@/database/repositories";
import { compare, hash } from "bcrypt";
import { Session, SessionData } from "express-session";
import { findAuthToken } from "./authTokenService";
import { findUserByUsername } from "./userService";

export class SignupError {
  declare error: string;
  constructor(error: string) {
    this.error = error;
  }
}

export async function signup(
  token: string,
  username: string,
  password: string,
  name: string,
  isAdmin: boolean = false
): Promise<User> {
  const authTokenErrorMessage = "Auth token is not valid";
  if (!AuthToken.verifyToken(token))
    throw new SignupError(authTokenErrorMessage);
  const authToken = await findAuthToken(token);
  if (!authToken) throw new SignupError(authTokenErrorMessage);

  const usernameError = User.verifyUsername(username);
  if (usernameError) throw new SignupError(usernameError);
  if (await findUserByUsername(username))
    throw new SignupError(`${username} is already taken.`);

  const passwordError = User.verifyPassword(password);
  if (passwordError) throw new SignupError(passwordError);

  const nameError = User.verifyName(name);
  if (nameError) throw new SignupError(nameError);

  await authTokenRepository.remove(authToken);
  const user = new User();
  user.username = username;
  user.passwordHash = Buffer.from(await hash(password, 10));
  user.name = name;
  user.isAdmin = isAdmin;
  return await userRepository.save(user);
}

export class SigninError {
  declare error: string;
  constructor(error: string) {
    this.error = error;
  }
}

export async function signin(
  session: Partial<SessionData>,
  username: string,
  password: string
): Promise<User> {
  const usernameErrorMessage = "Invalid username.";
  const passwordErrorMessage = "Invalid password.";

  const usernameError = User.verifyUsername(username);
  if (usernameError) throw new SigninError(usernameErrorMessage);
  const user = await findUserByUsername(username);
  if (!user) throw new SigninError(usernameErrorMessage);

  const passwordError = User.verifyPassword(password);
  if (passwordError) throw new SigninError(passwordErrorMessage);
  const isPasswordCorrect = await compare(
    password,
    user.passwordHash.toString()
  );
  if (!isPasswordCorrect) throw new SigninError(passwordErrorMessage);

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
