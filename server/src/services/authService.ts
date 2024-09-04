import { AuthToken } from "@/models/AuthToken";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import { Session, SessionData } from "express-session";
import { findUser } from "./userService";

type RequestSession = Session & Partial<SessionData>;

export class LoginError {
  declare messages: string[];
  constructor(messages: string[]) {
    this.messages = messages;
  }
}

export async function login(
  session: RequestSession,
  id: string,
  password: string
): Promise<void> {
  const idError = User.validateId(id);
  if (idError) throw new LoginError(idError);
  const user = await User.findOne({ where: { id } });
  if (!user) throw new LoginError(["ID does not exists."]);
  const passwordError = User.validatePassword(password);
  if (passwordError) throw new LoginError(passwordError);
  const matches = await bcrypt.compare(password, user.password.toString());
  if (!matches) throw new LoginError(["Password does not correct."]);
  session.userUid = user.uid;
  return;
}

export async function logout(session: RequestSession): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const isLoggedin = session.userUid !== undefined;
    session.destroy((error) => {
      if (error) reject(error);
      else resolve(isLoggedin);
    });
  });
}

export async function getOwnUserData(session: RequestSession) {
  const { userUid } = session;
  if (!userUid) return null;
  const user = await findUser(userUid);
  if (!user) return null;
  return {
    uuid: user.uuid,
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}

export async function findAuthToken(token: string): Promise<AuthToken | null> {
  if (AuthToken.validateToken(token)) return null;
  const authToken = await AuthToken.findOne({
    where: { token },
  });
  return authToken;
}
