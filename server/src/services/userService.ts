import { User } from "@/database/models/User";
import { userRepository } from "@/database/repositories";
import { UserName } from "@/valueObjects/userValueObjects";
import { SessionData } from "express-session";

export async function getUserByUid(uid: number): Promise<User | null> {
  return await userRepository.findOne({ where: { uid } });
}

export async function getUserByUsername(
  username: UserName
): Promise<User | null> {
  return await userRepository.findOne({
    where: { username: username.value },
  });
}

export async function getUserFromSession(
  session: Partial<SessionData>
): Promise<User | null> {
  const { userUid } = session;
  if (!userUid) return null;
  const user = await getUserByUid(userUid);
  if (!user) return null;
  return user;
}

export type PublicUserData = Pick<User, "username" | "name" | "createdAt">;

export function extractPublicUserData(user: User): PublicUserData {
  return {
    username: user.username,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export type ProtectedUserData = Pick<
  User,
  "username" | "name" | "isAdmin" | "createdAt"
>;

export function extractProtectedUserData(user: User): ProtectedUserData {
  return {
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}
