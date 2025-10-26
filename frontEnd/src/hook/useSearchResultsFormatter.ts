import { useMemo } from "react";

interface SearchResultsData {
  allResults?: { items: any[] };
  data: {
    products?: { items: any[] };
    tokos?: { items: any[] };
    berita?: { items: any[] };
    events?: { items: any[] };
    lomba?: { items: any[] };
  };
}

export const useSearchResultsFormatter = (
  searchResults: SearchResultsData | null,
) => {
  return useMemo(() => {
    if (!searchResults) return [];

    const results: any[] = [];

    if (searchResults.allResults?.items) {
      return searchResults.allResults.items;
    }

    if (searchResults.data.products?.items) {
      results.push(
        ...searchResults.data.products.items.map((item) => ({
          ...item,
          type: "product",
        })),
      );
    }
    if (searchResults.data.tokos?.items) {
      results.push(
        ...searchResults.data.tokos.items.map((item) => ({
          ...item,
          type: "toko",
        })),
      );
    }
    if (searchResults.data.berita?.items) {
      results.push(
        ...searchResults.data.berita.items.map((item) => ({
          ...item,
          type: "berita",
        })),
      );
    }
    if (searchResults.data.events?.items) {
      results.push(
        ...searchResults.data.events.items.map((item) => ({
          ...item,
          type: "event",
        })),
      );
    }
    if (searchResults.data.lomba?.items) {
      results.push(
        ...searchResults.data.lomba.items.map((item) => ({
          ...item,
          type: "lomba",
        })),
      );
    }

    return results;
  }, [searchResults]);
};
