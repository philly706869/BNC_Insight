import { CurrentUser } from "../types/User";

export type SignupResult =
  | {
      error: string;
    }
  | { user: CurrentUser };

export async function signup(
  authToken: string,
  username: string,
  password: string,
  name: string
): Promise<SignupResult> {
  // TODO
  return Promise.reject();
}

export async function signin(id: string, password: string) {}

export async function signout() {}
