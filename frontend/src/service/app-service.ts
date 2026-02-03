// src/service/app-service.ts
import axios from "axios";
import { toast } from "sonner";

export const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "https://backend-siketan.jagoansatudata.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Global cache disable headers
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// ===== REQUEST INTERCEPTOR =====
// Automatically add Authorization header to every request
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Add Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: Log request for debugging (remove in production)

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);

    return Promise.reject(error);
  },
);

// ===== RESPONSE INTERCEPTOR =====
// Handle responses and errors globally
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error);

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token invalid/expired
          console.log("🔐 Unauthorized access - clearing auth data");

          // Clear auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("user_id");

          // Show error toast
          toast.error("Sesi Anda telah berakhir", {
            description: "Silakan login kembali untuk melanjutkan",
          });

          // Redirect to login (after a short delay to show toast)
          setTimeout(() => {
            // Only redirect if not already on login page
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }, 1000);

          break;

        case 403:
          // Forbidden - No permission
          toast.error("Akses Ditolak", {
            description:
              "Anda tidak memiliki izin untuk mengakses resource ini",
          });
          break;

        case 404:
          // Not Found
          toast.error("Resource Tidak Ditemukan", {
            description: "Endpoint yang diminta tidak tersedia",
          });
          break;

        case 422:
          // Validation Error
          const validationMessage =
            data?.message || "Data yang dikirim tidak valid";

          toast.error("Validasi Error", {
            description: validationMessage,
          });
          break;

        case 429:
          // Too Many Requests
          toast.error("Terlalu Banyak Permintaan", {
            description: "Silakan tunggu beberapa saat sebelum mencoba lagi",
          });
          break;

        case 500:
          // Internal Server Error
          toast.error("Server Error", {
            description:
              "Terjadi kesalahan pada server. Silakan coba lagi nanti",
          });
          break;

        default:
          // Generic error
          const genericMessage =
            data?.message || "Terjadi kesalahan yang tidak diketahui";

          toast.error("Error", {
            description: genericMessage,
          });
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("🌐 Network Error:", error.request);
      toast.error("Masalah Koneksi", {
        description:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda",
      });
    } else {
      // Something else happened
      console.error("⚠️ Unknown Error:", error.message);
      toast.error("Error", {
        description: "Terjadi kesalahan yang tidak terduga",
      });
    }

    return Promise.reject(error);
  },
);

// ===== UTILITY FUNCTIONS =====

// Function to manually set token (useful for testing or dynamic token updates)
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Set default authorization header for all future requests
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    // Remove authorization header
    delete axiosClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Function to get current token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();

  return !!token;
};

// Function to make authenticated request manually (if needed)
export const authenticatedRequest = async (config: any) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  return axiosClient({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===== EXPORT DEFAULT =====
export default axiosClient;
