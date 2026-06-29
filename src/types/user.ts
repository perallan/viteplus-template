export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export type SortField = "name" | "email" | "company";
export type SortDirection = "ascending" | "descending";

export type SortOption = {
  field: SortField;
  direction: SortDirection;
};
