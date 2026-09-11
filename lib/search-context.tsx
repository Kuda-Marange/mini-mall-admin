"use client";

import * as React from "react";

interface SearchContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const SearchContext = React.createContext<SearchContextValue | undefined>(
  undefined
);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = React.useState("");

  const value = React.useMemo(() => ({ search, setSearch }), [search]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}