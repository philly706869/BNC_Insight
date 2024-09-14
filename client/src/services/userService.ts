import { CurrentUser } from "../types/User";

export let tempCurrentUser: CurrentUser = {
  username: "test",
  name: "Test",
  isAdmin: true,
  createdAt: String(new Date()),
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return tempCurrentUser;
}

export type VerifyResult = {
  error?: string;
};

export async function verifyAuthToken(value: string): Promise<VerifyResult> {
  // TODO
  if (value !== "temptoken")
    return {
      error: "This message is temp error message. test token is `temptoken`",
    };
  return {};
}

export async function verifyUsername(value: string): Promise<VerifyResult> {
  // TODO
  if (value !== "tempusername")
    return {
      error: "This message is temp error message. test token is `tempusername`",
    };
  return {};
}

export async function verifyPassword(value: string): Promise<VerifyResult> {
  // TODO
  if (value !== "temppassword")
    return {
      error: "This message is temp error message. test token is `temppassword`",
    };
  return {};
}

export async function verifyName(value: string): Promise<VerifyResult> {
  // TODO
  if (value !== "tempname")
    return {
      error: "This message is temp error message. test token is `tempname`",
    };
  return {};
}
