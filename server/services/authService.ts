import { User } from "@/models/User";
import {
  PublicSessionData,
  SessionData,
  UserSessionData,
} from "@/types/session";
import bcrypt from "bcrypt";
import { SessionData as ExpressSessionData, Session } from "express-session";

type RequestSession = Session & Partial<ExpressSessionData>;

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
): Promise<SessionData> {
  const idError = User.validateId(id);
  if (idError) throw new LoginError(idError);
  const user = await User.findOne({ where: { id } });
  if (!user) throw new LoginError(["ID does not exists."]);
  const passwordError = User.validatePassword(password);
  if (passwordError) throw new LoginError(passwordError);
  const matches = await bcrypt.compare(password, user.password.toString());
  if (!matches) throw new LoginError(["Password does not correct."]);
  const userSessionData: UserSessionData = {
    uid: user.uid,
    uuid: user.uuid,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
  session.user = userSessionData;
  return { user: userSessionData };
}

export async function logout(session: RequestSession): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const isLoggedin = session.user !== undefined;
    session.destroy((error) => {
      if (error) reject(error);
      else resolve(isLoggedin);
    });
  });
}

export function getPublicSessionData(
  session: RequestSession
): PublicSessionData {
  const { user } = session;
  return {
    user: user
      ? {
          uuid: user.uuid,
          name: user.name,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        }
      : null,
  };
}
