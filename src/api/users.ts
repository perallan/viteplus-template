import type { User } from "../types/user";

const USERS_ENDPOINT = "https://jsonplaceholder.typicode.com/users";

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(
    USERS_ENDPOINT,
    signal ? { signal } : undefined,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return (await response.json()) as User[];
}
