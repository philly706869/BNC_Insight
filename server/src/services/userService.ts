import { User } from "@/database/models/User";
import { userRepository } from "@/database/repositories";
import { UserName } from "@/valueObjects/userValueObjects";
import { SessionData } from "express-session";
import { FindOneOptions } from "typeorm";

export async function findUserByUid(
  uid: number,
  options?: FindOneOptions<User>
): Promise<User | null> {
  return await userRepository.findOne({ ...options, where: { uid } });
}

export async function findUserByUsername(
  username: UserName,
  options?: FindOneOptions<User>
): Promise<User | null> {
  return await userRepository.findOne({
    ...options,
    where: { username: username.value },
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

export type CurrentUser = Pick<
  User,
  "username" | "name" | "isAdmin" | "createdAt"
>;

export function extractCurrentUser(user: User): CurrentUser {
  return {
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}
