import { User } from "@/database/entities/user";
import { userRepository } from "@/database/repositories";
import { SessionData } from "express-session";

export async function findUserByUid(uid: number): Promise<User | null> {
  return await userRepository.findOne({ where: { uid } });
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  return await userRepository.findOne({
    where: { username },
  });
}

export async function getUserFromSession(
  session: Partial<SessionData>
): Promise<User | null> {
  const { userUid } = session;
  if (!userUid) return null;
  const user = await findUserByUid(userUid);
  if (!user) return null;
  return user;
}
