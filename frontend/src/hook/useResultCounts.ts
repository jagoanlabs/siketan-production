import { useMemo } from "react";

interface SearchResultsData {
  pagination?: { totalResults: number };
  data: {
    products?: { total: number };
    tokos?: { total: number };
    berita?: { total: number };
    events?: { total: number };
    lomba?: { total: number };
  };
}

export const useResultCounts = (searchResults: SearchResultsData | null) => {
  return useMemo(() => {
    if (!searchResults) {
      return { all: 0, product: 0, toko: 0, berita: 0, lomba: 0 };
    }

    const counts = {
      all: searchResults.pagination?.totalResults || 0,
      product: searchResults.data.products?.total || 0,
      toko: searchResults.data.tokos?.total || 0,
      berita: searchResults.data.berita?.total || 0,
      lomba:
        (searchResults.data.events?.total || 0) +
        (searchResults.data.lomba?.total || 0),
    };

    return counts;
  }, [searchResults]);
};
