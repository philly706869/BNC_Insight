import { compare } from "bcrypt";
import { Session, SessionData } from "express-session";
import { findUserById, UserFindException } from "./userService";
import { verifyUserPasswordFormat } from "./verificationService";

export type LoginErrors = "INVALID_ID" | "INVALID_PASSWORD";

export class LoginException {
  declare error: LoginErrors;
  constructor(error: LoginErrors) {
    this.error = error;
  }
}

export async function login(
  session: Partial<SessionData>,
  id: string,
  password: string
): Promise<void> {
  try {
    const user = await findUserById(id);
    if (!user) throw new LoginException("INVALID_ID");

    const passwordVerificationResult = verifyUserPasswordFormat(password);
    if (passwordVerificationResult.error)
      throw new LoginException("INVALID_PASSWORD");
    const isPasswordCorrect = await compare(
      password,
      user.passwordHash.toString()
    );
    if (!isPasswordCorrect) throw new LoginException("INVALID_PASSWORD");

    session.userUid = user.uid;
  } catch (error) {
    if (error instanceof UserFindException)
      throw new LoginException("INVALID_ID");
    throw error;
  }
}

export async function logout(
  session: Session & Partial<SessionData>
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const isLoggedin = session.userUid !== undefined;
    session.destroy((error) => {
      if (error) reject(error);
      else resolve(isLoggedin);
    });
  });
}
