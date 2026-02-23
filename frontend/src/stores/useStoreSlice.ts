// stores/useStoreSlice.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Types
interface Store {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  location: string;
  products: number;
  rating: number;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Product {
  id: string;
  title: string;
  price: number | string;
  image: string;
  link: string;
  storeId?: string;
  category?: string;
  rating?: number;
  sold?: number;
  stock?: number;
}

interface StoreFilters {
  search: string;
  location: string;
  minRating: number;
  category: string;
  sortBy: "rating" | "products" | "name" | "newest";
}

interface StoreState {
  // Data
  stores: Store[];
  products: Product[];
  selectedStore: Store | null;
  selectedProduct: Product | null;

  // UI State
  loading: boolean;
  error: string | null;
  selectedTab: "produk" | "toko";

  // Filters
  filters: StoreFilters;

  // Pagination
  currentPage: {
    products: number;
    stores: number;
  };
  itemsPerPage: number;

  // Actions - Stores
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  updateStore: (id: string, store: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  selectStore: (store: Store | null) => void;

  // Actions - Products
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (product: Product | null) => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTab: (tab: "produk" | "toko") => void;

  // Actions - Filters
  updateFilters: (filters: Partial<StoreFilters>) => void;
  clearFilters: () => void;
  setSearch: (search: string) => void;

  // Actions - Pagination
  setCurrentPage: (type: "products" | "stores", page: number) => void;
  setItemsPerPage: (count: number) => void;

  // Computed/Derived State
  getFilteredStores: () => Store[];
  getFilteredProducts: () => Product[];
  getPaginatedStores: () => Store[];
  getPaginatedProducts: () => Product[];
  getTotalPages: (type: "products" | "stores") => number;

  // Async Actions
  fetchStores: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchStoreById: (id: string) => Promise<void>;

  // Utils
  resetStore: () => void;
}

// Initial State
const initialFilters: StoreFilters = {
  search: "",
  location: "",
  minRating: 0,
  category: "",
  sortBy: "rating",
};

// Create Store
const useStoreSlice = create<StoreState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial Data
        stores: [],
        products: [],
        selectedStore: null,
        selectedProduct: null,

        // Initial UI State
        loading: false,
        error: null,
        selectedTab: "produk",

        // Initial Filters
        filters: initialFilters,

        // Initial Pagination
        currentPage: {
          products: 1,
          stores: 1,
        },
        itemsPerPage: 20,

        // Store Actions
        setStores: (stores) =>
          set((state) => {
            state.stores = stores;
            state.loading = false;
            state.error = null;
          }),

        addStore: (store) =>
          set((state) => {
            state.stores.push({
              ...store,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }),

        updateStore: (id, storeUpdate) =>
          set((state) => {
            const index = state.stores.findIndex((s) => s.id === id);

            if (index !== -1) {
              state.stores[index] = {
                ...state.stores[index],
                ...storeUpdate,
                updatedAt: new Date(),
              };
            }
          }),

        deleteStore: (id) =>
          set((state) => {
            state.stores = state.stores.filter((s) => s.id !== id);
            if (state.selectedStore?.id === id) {
              state.selectedStore = null;
            }
          }),

        selectStore: (store) =>
          set((state) => {
            state.selectedStore = store;
          }),

        // Product Actions
        setProducts: (products) =>
          set((state) => {
            state.products = products;
            state.loading = false;
            state.error = null;
          }),

        addProduct: (product) =>
          set((state) => {
            state.products.push(product);
          }),

        updateProduct: (id, productUpdate) =>
          set((state) => {
            const index = state.products.findIndex((p) => p.id === id);

            if (index !== -1) {
              state.products[index] = {
                ...state.products[index],
                ...productUpdate,
              };
            }
          }),

        deleteProduct: (id) =>
          set((state) => {
            state.products = state.products.filter((p) => p.id !== id);
            if (state.selectedProduct?.id === id) {
              state.selectedProduct = null;
            }
          }),

        selectProduct: (product) =>
          set((state) => {
            state.selectedProduct = product;
          }),

        // UI Actions
        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.loading = false;
          }),

        setSelectedTab: (tab) =>
          set((state) => {
            state.selectedTab = tab;
          }),

        // Filter Actions
        updateFilters: (filters) =>
          set((state) => {
            state.filters = { ...state.filters, ...filters };
            // Reset to page 1 when filters change
            state.currentPage.products = 1;
            state.currentPage.stores = 1;
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = initialFilters;
            state.currentPage.products = 1;
            state.currentPage.stores = 1;
          }),

        setSearch: (search) =>
          set((state) => {
            state.filters.search = search;
            state.currentPage.products = 1;
            state.currentPage.stores = 1;
          }),

        // Pagination Actions
        setCurrentPage: (type, page) =>
          set((state) => {
            state.currentPage[type] = page;
          }),

        setItemsPerPage: (count) =>
          set((state) => {
            state.itemsPerPage = count;
            state.currentPage.products = 1;
            state.currentPage.stores = 1;
          }),

        // Computed/Derived State
        getFilteredStores: () => {
          const state = get();
          let filtered = [...state.stores];

          // Apply search filter
          if (state.filters.search) {
            filtered = filtered.filter(
              (store) =>
                store.title
                  .toLowerCase()
                  .includes(state.filters.search.toLowerCase()) ||
                store.description
                  .toLowerCase()
                  .includes(state.filters.search.toLowerCase()),
            );
          }

          // Apply location filter
          if (state.filters.location) {
            filtered = filtered.filter((store) =>
              store.location
                .toLowerCase()
                .includes(state.filters.location.toLowerCase()),
            );
          }

          // Apply rating filter
          if (state.filters.minRating > 0) {
            filtered = filtered.filter(
              (store) => store.rating >= state.filters.minRating,
            );
          }

          // Apply sorting
          switch (state.filters.sortBy) {
            case "rating":
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            case "products":
              filtered.sort((a, b) => b.products - a.products);
              break;
            case "name":
              filtered.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case "newest":
              filtered.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

                return dateB - dateA;
              });
              break;
          }

          return filtered;
        },

        getFilteredProducts: () => {
          const state = get();
          let filtered = [...state.products];

          // Apply search filter
          if (state.filters.search) {
            filtered = filtered.filter((product) =>
              product.title
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()),
            );
          }

          // Apply category filter
          if (state.filters.category) {
            filtered = filtered.filter(
              (product) => product.category === state.filters.category,
            );
          }

          // Apply sorting
          switch (state.filters.sortBy) {
            case "rating":
              filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
              break;
            case "name":
              filtered.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case "newest":
              filtered.sort((a, b) => {
                // Assuming products have an order based on array index
                return state.products.indexOf(b) - state.products.indexOf(a);
              });
              break;
          }

          return filtered;
        },

        getPaginatedStores: () => {
          const state = get();
          const filtered = state.getFilteredStores();
          const start = (state.currentPage.stores - 1) * state.itemsPerPage;
          const end = start + state.itemsPerPage;

          return filtered.slice(start, end);
        },

        getPaginatedProducts: () => {
          const state = get();
          const filtered = state.getFilteredProducts();
          const start = (state.currentPage.products - 1) * state.itemsPerPage;
          const end = start + state.itemsPerPage;

          return filtered.slice(start, end);
        },

        getTotalPages: (type) => {
          const state = get();
          const items =
            type === "products"
              ? state.getFilteredProducts()
              : state.getFilteredStores();

          return Math.ceil(items.length / state.itemsPerPage);
        },

        // Async Actions
        fetchStores: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            // Simulate API call
            const response = await fetch("/api/stores");

            if (!response.ok) throw new Error("Failed to fetch stores");

            const data = await response.json();

            set((state) => {
              state.stores = data;
              state.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.error =
                error instanceof Error ? error.message : "An error occurred";
              state.loading = false;
            });
          }
        },

        fetchProducts: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            // Simulate API call
            const response = await fetch("/api/products");

            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();

            set((state) => {
              state.products = data;
              state.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.error =
                error instanceof Error ? error.message : "An error occurred";
              state.loading = false;
            });
          }
        },

        fetchStoreById: async (id) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            // Simulate API call
            const response = await fetch(`/api/stores/${id}`);

            if (!response.ok) throw new Error("Failed to fetch store");

            const data = await response.json();

            set((state) => {
              state.selectedStore = data;
              state.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.error =
                error instanceof Error ? error.message : "An error occurred";
              state.loading = false;
            });
          }
        },

        // Reset Store
        resetStore: () =>
          set((state) => {
            state.stores = [];
            state.products = [];
            state.selectedStore = null;
            state.selectedProduct = null;
            state.loading = false;
            state.error = null;
            state.selectedTab = "produk";
            state.filters = initialFilters;
            state.currentPage = { products: 1, stores: 1 };
            state.itemsPerPage = 20;
          }),
      })),
      {
        name: "store-storage", // name of the item in localStorage
        partialize: (state) => ({
          // Only persist certain parts of the state
          stores: state.stores,
          products: state.products,
          filters: state.filters,
          selectedTab: state.selectedTab,
        }),
      },
    ),
  ),
);

export default useStoreSlice;

// Selectors (optional - for better performance with React)
export const useStores = () => useStoreSlice((state) => state.stores);
export const useProducts = () => useStoreSlice((state) => state.products);
export const useSelectedStore = () =>
  useStoreSlice((state) => state.selectedStore);
export const useSelectedProduct = () =>
  useStoreSlice((state) => state.selectedProduct);
export const useLoading = () => useStoreSlice((state) => state.loading);
export const useError = () => useStoreSlice((state) => state.error);
export const useFilters = () => useStoreSlice((state) => state.filters);
export const useSelectedTab = () => useStoreSlice((state) => state.selectedTab);
