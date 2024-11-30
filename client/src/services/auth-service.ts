export const AUTH_SERVICE_URL = "/api/auth";

export type ProtectedUser = {
  username: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
};

export async function verifyAuthToken(value: string): Promise<boolean> {
  const response = await fetch(`${AUTH_SERVICE_URL}/verify-auth-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
    }),
  });
  return response.ok;
}

export async function getCurrentUser(): Promise<ProtectedUser | null> {
  const response = await fetch(`${AUTH_SERVICE_URL}/me`);
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}

export async function signup(
  token: string,
  username: string,
  password: string,
  name: string
): Promise<void> {
  const response = await fetch(`${AUTH_SERVICE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      username,
      password,
      name,
    }),
  });
  if (!response.ok) {
    return Promise.reject(await response.json());
  }
}

export async function signin(
  username: string,
  password: string
): Promise<void> {
  const response = await fetch(`${AUTH_SERVICE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function signout(): Promise<void> {
  const response = await fetch(`${AUTH_SERVICE_URL}/signout`, {
    method: "POST",
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(`${AUTH_SERVICE_URL}/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}
