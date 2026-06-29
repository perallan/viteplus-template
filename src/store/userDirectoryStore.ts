import { create } from "zustand";
import type { SortField, SortOption } from "../types/user";

type UserDirectoryState = {
  searchTerm: string;
  sort: SortOption;
  setSearchTerm: (searchTerm: string) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
};

export const useUserDirectoryStore = create<UserDirectoryState>((set) => ({
  searchTerm: "",
  sort: {
    field: "name",
    direction: "ascending",
  },
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSortField: (field) =>
    set((state) => ({
      sort: {
        field,
        direction:
          state.sort.field === field ? state.sort.direction : "ascending",
      },
    })),
  toggleSortDirection: () =>
    set((state) => ({
      sort: {
        ...state.sort,
        direction:
          state.sort.direction === "ascending" ? "descending" : "ascending",
      },
    })),
}));

export const resetUserDirectoryStore = () => {
  useUserDirectoryStore.setState({
    searchTerm: "",
    sort: {
      field: "name",
      direction: "ascending",
    },
  });
};
