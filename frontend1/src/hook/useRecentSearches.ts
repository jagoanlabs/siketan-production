import { useCallback } from "react";

export const useRecentSearches = () => {
  const getRecentSearches = useCallback((): string[] => {
    try {
      const recent = localStorage.getItem("recentSearches");

      return recent ? JSON.parse(recent).slice(0, 5) : [];
    } catch {
      return [];
    }
  }, []);

  return { getRecentSearches };
};
