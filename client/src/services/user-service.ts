export type PublicUser = {
  username: string;
  name: string;
};

export async function getUser(username: string): Promise<PublicUser> {
  const response = await fetch(`/api/users/${username}`);
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}

export async function patchUser(data: {
  username?: string;
  name?: string;
}): Promise<void> {
  const response = await fetch("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      name: data.name,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function deleteUser(): Promise<void> {
  const response = await fetch("/api/users", {
    method: "DELETE",
  });
  if (!response.ok) {
    return Promise.reject();
  }
}
