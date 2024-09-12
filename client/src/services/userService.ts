import { CurrentUser } from "../types/User";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return {
    username: "test",
    name: "Test",
    isAdmin: false,
    createdAt: new Date(Date.now()),
  };
}

export async function verifyAuthToken(authToken: string) {}

export async function verifyId(id: string) {}

export async function verifyPassword(password: string) {}

export async function verifyName(name: string) {}
