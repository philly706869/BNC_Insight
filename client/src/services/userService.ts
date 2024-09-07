import { CurrentUser } from "../types/User";

export async function getMe(): Promise<CurrentUser | null> {
  return {
    id: "test",
    name: "Test",
    isAdmin: false,
  };
}

export async function verifyAuthToken(authToken: string) {
  await fetch("/api/verify/auth-token").then((res) => res.json());
}

export async function verifyId(id: string) {}

export async function verifyPassword(password: string) {}

export async function verifyName(name: string) {}

export async function createUser(
  authToken: string,
  id: string,
  password: string,
  name: string
) {}
