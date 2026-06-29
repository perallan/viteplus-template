import { useMemo } from "react";
import { useUsers } from "../hooks/useUsers";
import { useUserDirectoryStore } from "../store/userDirectoryStore";
import type { SortField, User } from "../types/user";
import "./UserDirectory.css";

const sortLabels: Record<SortField, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
};

function getSortableValue(user: User, field: SortField): string {
  return field === "company" ? user.company.name : user[field];
}

function matchesSearch(user: User, normalizedSearch: string): boolean {
  const searchableValues = [
    user.name,
    user.username,
    user.email,
    user.company.name,
  ];

  return searchableValues.some((value) =>
    value.toLocaleLowerCase().includes(normalizedSearch),
  );
}

function filterAndSortUsers(
  users: User[],
  searchTerm: string,
  sortField: SortField,
  sortDirection: "ascending" | "descending",
): User[] {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filteredUsers =
    normalizedSearch.length === 0
      ? users
      : users.filter((user) => matchesSearch(user, normalizedSearch));

  return filteredUsers.toSorted((leftUser, rightUser) => {
    const comparison = getSortableValue(leftUser, sortField).localeCompare(
      getSortableValue(rightUser, sortField),
      undefined,
      { sensitivity: "base" },
    );

    return sortDirection === "ascending" ? comparison : -comparison;
  });
}

export function UserDirectory() {
  const { users, isLoading, error } = useUsers();
  const searchTerm = useUserDirectoryStore((state) => state.searchTerm);
  const sort = useUserDirectoryStore((state) => state.sort);
  const setSearchTerm = useUserDirectoryStore((state) => state.setSearchTerm);
  const setSortField = useUserDirectoryStore((state) => state.setSortField);
  const toggleSortDirection = useUserDirectoryStore(
    (state) => state.toggleSortDirection,
  );

  const visibleUsers = useMemo(
    () => filterAndSortUsers(users, searchTerm, sort.field, sort.direction),
    [users, searchTerm, sort.field, sort.direction],
  );

  return (
    <section className="user-directory" aria-labelledby="user-directory-title">
      <header className="user-directory__header">
        <div>
          <p className="user-directory__eyebrow">JSONPlaceholder</p>
          <h1 id="user-directory-title">User directory</h1>
        </div>
        <p className="user-directory__count" aria-live="polite">
          {isLoading ? "Loading users" : `${visibleUsers.length} users`}
        </p>
      </header>

      <div className="user-directory__toolbar" aria-label="Directory controls">
        <label className="user-directory__field">
          <span>Search</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            placeholder="Name, username, email, or company"
          />
        </label>

        <label className="user-directory__field user-directory__field--compact">
          <span>Sort by</span>
          <select
            value={sort.field}
            onChange={(event) =>
              setSortField(event.currentTarget.value as SortField)
            }
          >
            {Object.entries(sortLabels).map(([field, label]) => (
              <option key={field} value={field}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          className="user-directory__direction"
          type="button"
          onClick={toggleSortDirection}
          aria-label={`Sort ${
            sort.direction === "ascending" ? "descending" : "ascending"
          }`}
        >
          {sort.direction === "ascending" ? "A-Z" : "Z-A"}
        </button>
      </div>

      {isLoading ? (
        <div className="user-directory__state" role="status">
          Loading users...
        </div>
      ) : null}

      {error ? (
        <div className="user-directory__state user-directory__state--error" role="alert">
          Unable to load users. {error}
        </div>
      ) : null}

      {!isLoading && !error && visibleUsers.length === 0 ? (
        <div className="user-directory__state">No users match your search.</div>
      ) : null}

      {!isLoading && !error && visibleUsers.length > 0 ? (
        <ul className="user-directory__list" aria-label="Users">
          {visibleUsers.map((user) => (
            <li className="user-card" key={user.id}>
              <div>
                <h2>{user.name}</h2>
                <p>@{user.username}</p>
              </div>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Company</dt>
                  <dd>{user.company.name}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export { filterAndSortUsers };
