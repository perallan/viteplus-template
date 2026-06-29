import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetUserDirectoryStore } from "../store/userDirectoryStore";
import { usersFixture } from "../test/users";
import { UserDirectory, filterAndSortUsers } from "./UserDirectory";

function mockFetchSuccess(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(body),
    }),
  );
}

function mockFetchFailure() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }),
  );
}

describe("UserDirectory", () => {
  beforeEach(() => {
    resetUserDirectoryStore();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders loading state before users resolve", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));

    render(<UserDirectory />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading users");
  });

  it("fetches and renders users from JSONPlaceholder", async () => {
    mockFetchSuccess(usersFixture);

    render(<UserDirectory />);

    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("@Bret")).toBeInTheDocument();
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("searches by name, username, email, and company", async () => {
    const user = userEvent.setup();
    mockFetchSuccess(usersFixture);

    render(<UserDirectory />);

    await screen.findByText("Leanne Graham");
    const search = screen.getByRole("searchbox", { name: "Search" });

    await user.type(search, "samantha");
    expect(screen.getByText("Clementine Bauch")).toBeInTheDocument();
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "melissa");
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.queryByText("Clementine Bauch")).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "romaguera-crona");
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("sorts by company and toggles direction", async () => {
    const user = userEvent.setup();
    mockFetchSuccess(usersFixture);

    render(<UserDirectory />);

    await screen.findByText("Leanne Graham");
    await user.selectOptions(screen.getByLabelText("Sort by"), "company");

    const ascendingItems = within(screen.getByRole("list", { name: "Users" }))
      .getAllByRole("listitem")
      .map((item) => within(item).getByRole("heading").textContent);

    expect(ascendingItems).toEqual([
      "Ervin Howell",
      "Leanne Graham",
      "Clementine Bauch",
    ]);

    await user.click(screen.getByRole("button", { name: "Sort descending" }));

    const descendingItems = within(screen.getByRole("list", { name: "Users" }))
      .getAllByRole("listitem")
      .map((item) => within(item).getByRole("heading").textContent);

    expect(descendingItems).toEqual([
      "Clementine Bauch",
      "Leanne Graham",
      "Ervin Howell",
    ]);
  });

  it("renders an empty state when no users match search", async () => {
    const user = userEvent.setup();
    mockFetchSuccess(usersFixture);

    render(<UserDirectory />);

    await screen.findByText("Leanne Graham");
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "nope");

    expect(screen.getByText("No users match your search.")).toBeInTheDocument();
  });

  it("renders an error state when the request fails", async () => {
    mockFetchFailure();

    render(<UserDirectory />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load users.",
    );
  });
});

describe("filterAndSortUsers", () => {
  it("keeps filtering and sorting deterministic without mutating input", () => {
    const originalOrder = usersFixture.map((user) => user.id);

    const result = filterAndSortUsers(
      usersFixture,
      "romaguera",
      "email",
      "descending",
    );

    expect(result.map((user) => user.name)).toEqual([
      "Leanne Graham",
      "Clementine Bauch",
    ]);
    expect(usersFixture.map((user) => user.id)).toEqual(originalOrder);
  });
});
