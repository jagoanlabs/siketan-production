import { axiosClient } from "./app-service";

// Types untuk response API
export interface SearchProduct {
  id: number;
  type: "product";
  title: string;
  description: string;
  price: string;
  satuan: string;
  stock: number;
  status: string;
  image: string;
  seller: {
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  namaProducts: string;
  deskripsi: string;
  relevanceScore: number;
  searchType: string;
}

export interface SearchToko {
  id: number;
  type: "toko";
  name: string;
  namaToko: string;
  address: string;
  phone: string;
  owner: string;
  profileToko?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore: number;
  searchType: string;
}

export interface SearchBerita {
  id: number;
  type: "berita" | "artikel" | "tips";
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  publishedAt: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  judul: string;
  isi: string;
  kategori: string;
  createdBy: string;
  relevanceScore: number;
  searchType: string;
}

export interface SearchEvent {
  id: number;
  type: "lomba" | "event";
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore: number;
  searchType: string;
}

export interface SearchDataGroup {
  items: any[];
  total: number;
  showing: number;
}

export interface SearchPagination {
  currentPage: number;
  limit: number;
  totalResults: number;
  totalPages: number;
  from: number;
  to: number;
}

export interface SearchResponse {
  message: string;
  query: string;
  type: string;
  sortBy: string;
  data: {
    products?: SearchDataGroup;
    tokos?: SearchDataGroup;
    berita?: SearchDataGroup;
    events?: SearchDataGroup;
    lomba?: SearchDataGroup;
  };
  pagination: SearchPagination;
  allResults?: SearchDataGroup;
}

export type SearchType =
  | "all"
  | "product"
  | "toko"
  | "berita"
  | "lomba"
  | "event";
export type SortBy = "relevance" | "newest" | "price-asc" | "price-desc";

export interface SearchParams {
  q: string;
  type?: SearchType;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

class SearchService {
  /**
   * Melakukan pencarian umum
   * @param params - Parameter pencarian
   * @returns Promise dengan hasil pencarian
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Required parameter
      queryParams.append("q", params.q);

      // Optional parameters
      if (params.type && params.type !== "all") {
        queryParams.append("type", params.type);
      }
      if (params.sortBy) {
        queryParams.append("sortBy", params.sortBy);
      }
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }
      if (params.minPrice !== undefined) {
        queryParams.append("minPrice", params.minPrice.toString());
      }
      if (params.maxPrice !== undefined) {
        queryParams.append("maxPrice", params.maxPrice.toString());
      }

      const response = await axiosClient.get<SearchResponse>(
        `/search?${queryParams.toString()}`,
      );

      return response.data;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }

  /**
   * Pencarian produk spesifik
   * @param query - Kata kunci pencarian
   * @param params - Parameter tambahan
   * @returns Promise dengan hasil pencarian produk
   */
  async searchProducts(
    query: string,
    params?: Partial<SearchParams>,
  ): Promise<SearchResponse> {
    return this.search({
      q: query,
      type: "product",
      ...params,
    });
  }

  /**
   * Pencarian toko spesifik
   * @param query - Kata kunci pencarian
   * @param params - Parameter tambahan
   * @returns Promise dengan hasil pencarian toko
   */
  async searchTokos(
    query: string,
    params?: Partial<SearchParams>,
  ): Promise<SearchResponse> {
    return this.search({
      q: query,
      type: "toko",
      ...params,
    });
  }

  /**
   * Pencarian berita/artikel spesifik
   * @param query - Kata kunci pencarian
   * @param params - Parameter tambahan
   * @returns Promise dengan hasil pencarian berita
   */
  async searchBerita(
    query: string,
    params?: Partial<SearchParams>,
  ): Promise<SearchResponse> {
    return this.search({
      q: query,
      type: "berita",
      ...params,
    });
  }

  /**
   * Pencarian lomba/event spesifik
   * @param query - Kata kunci pencarian
   * @param params - Parameter tambahan
   * @returns Promise dengan hasil pencarian lomba/event
   */
  async searchEvents(
    query: string,
    params?: Partial<SearchParams>,
  ): Promise<SearchResponse> {
    return this.search({
      q: query,
      type: "lomba",
      ...params,
    });
  }

  /**
   * Mendapatkan saran pencarian berdasarkan query
   * @param query - Kata kunci untuk saran
   * @returns Promise dengan array saran
   */
  async getSuggestions(query: string): Promise<string[]> {
    try {
      // Jika ada endpoint khusus untuk suggestions, gunakan ini
      // const response = await axiosClient.get<{suggestions: string[]}>(`/search/suggestions?q=${query}`);
      // return response.data.suggestions;

      // Untuk sementara, kita ambil dari hasil search dan ekstrak title
      const response = await this.search({ q: query, limit: 10 });
      const suggestions = new Set<string>();

      // Ekstrak title dari semua hasil
      if (response.data.products?.items) {
        response.data.products.items.forEach((item) =>
          suggestions.add(item.title),
        );
      }
      if (response.data.tokos?.items) {
        response.data.tokos.items.forEach((item) =>
          suggestions.add(item.namaToko || item.name),
        );
      }
      if (response.data.berita?.items) {
        response.data.berita.items.forEach((item) =>
          suggestions.add(item.title),
        );
      }
      if (response.data.events?.items) {
        response.data.events.items.forEach((item) =>
          suggestions.add(item.title),
        );
      }

      return Array.from(suggestions).slice(0, 8);
    } catch (error) {
      console.error("Get suggestions error:", error);

      return [];
    }
  }

  /**
   * Mendapatkan popular searches
   * @returns Promise dengan array popular searches
   */
  async getPopularSearches(): Promise<string[]> {
    try {
      // Jika ada endpoint khusus untuk popular searches
      // const response = await axiosClient.get<{searches: string[]}>('/search/popular');
      // return response.data.searches;

      // Default popular searches
      return [
        "Pupuk Organik",
        "Bibit Padi",
        "Pestisida Alami",
        "Alat Pertanian",
        "Beras Premium",
        "Jagung Hibrida",
      ];
    } catch (error) {
      console.error("Get popular searches error:", error);

      return [];
    }
  }
}

// Export singleton instance
export const searchService = new SearchService();
