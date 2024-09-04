import { User } from "@/models/User";
import { findAllocableAuthToken } from "./authService";

export class UserCreationError {
  declare message: string;
  constructor(message: string) {
    this.message = message;
  }
}

type UserCreationProps = {
  token: string;
  id: string;
  password: string;
  name: string;
};

export async function createUser({
  token,
  id,
  password,
  name,
}: UserCreationProps): Promise<User> {
  const authToken = await findAllocableAuthToken(token);
  if (!authToken) throw new UserCreationError("Invalid auth token.");
  if (await findUserById(id)) throw new UserCreationError("Invalid id.");
}

export async function findUserByUid(uid: number): Promise<User | null> {
  return await User.findOne({ where: { uid } });
}

export async function findUserByUuid(uuid: string): Promise<User | null> {
  return await User.findOne({ where: { uuid } });
}

export async function findUserById(id: string): Promise<User | null> {
  if (User.validateId(id)) return null;
  return await User.findOne({ where: { id } });
}

export async function updateUser() {}

export async function deleteUser(uid: number): Promise<boolean>;
export async function deleteUser(uuid: string): Promise<boolean>;
export async function deleteUser(identifier: number | string): Promise<boolean>;
export async function deleteUser(
  identifier: number | string
): Promise<boolean> {
  const user = await findUser(identifier);
  if (!user) return false;
  user.remove();
  return true;
}
