import { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import type { User } from "../types/user";

type UsersState = {
  users: User[];
  isLoading: boolean;
  error: string | null;
};

export function useUsers(): UsersState {
  const [state, setState] = useState<UsersState>({
    users: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    fetchUsers(controller.signal)
      .then((users) => {
        setState({
          users,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({
          users: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred while loading users.",
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  return state;
}
