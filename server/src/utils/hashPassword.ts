import { UserValue } from "@/database/values/user-values";
import { hash } from "bcrypt";

export async function hashPassword(
  password: UserValue.Password
): Promise<string> {
  return await hash(password.value, 10);
}
