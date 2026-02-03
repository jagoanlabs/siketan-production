import { useDashboardData } from "@/hook/dashboard/useDashboardDataCard";

export const DashboardCardAdmin = () => {
  const { data: dashboardData, isLoading, isError, error } = useDashboardData();

  if (isLoading) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  // Tampilkan error state
  if (isError) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <h3 className="text-lg font-medium">Gagal memuat data</h3>
            <p>{error?.message || "Terjadi kesalahan saat mengambil data"}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Card Statistik dengan data dari API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {/* Card Jumlah Berita */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Jumlah Berita
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.berita || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Card Jumlah Artikel */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Jumlah Artikel
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.artikel || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Card Jumlah Tips */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Jumlah Tips
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.tips || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Card Petani Terverifikasi */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Petani Terverifikasi
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.verifiedPetani || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Card Petani Belum Terverifikasi */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Belum Terverifikasi
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.unverifiedPetani || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
