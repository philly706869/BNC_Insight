import { User } from "@/models/User";
import {
  PublicSessionData,
  SessionData,
  UserSessionData,
} from "@/types/session";
import bcrypt from "bcrypt";
import { SessionData as ExpressSessionData, Session } from "express-session";

type RequestSession = Session & Partial<ExpressSessionData>;

export async function login(
  session: RequestSession,
  id: string,
  password: string,
  callback: (error: string[] | null, session: SessionData | null) => any
): Promise<void> {
  const idError = User.validateId(id);
  if (idError) {
    callback(idError, null);
    return;
  }

  const user = await User.findOne({ where: { id } });
  if (!user) {
    callback(["ID does not exists."], null);
    return;
  }

  const passwordError = User.validatePassword(password);
  if (passwordError) {
    callback(passwordError, null);
    return;
  }

  const matches = await bcrypt.compare(password, user.password.toString());
  if (!matches) {
    callback(["Password does not correct."], null);
    return;
  }

  const userSessionData: UserSessionData = {
    uid: user.uid,
    uuid: user.uuid,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
  session.user = userSessionData;
  callback(null, { user: userSessionData });
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
