import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";

export const Chatbot = () => {
  // URL Dashboard Tawk.to
  const tawkToUrl = "https://dashboard.tawk.to";

  // Fungsi untuk membuka dashboard di tab baru
  const openInNewTab = () => {
    window.open(tawkToUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      {/* Metadata Halaman */}
      <PageMeta
        description="Dashboard Chatbot Tawk.to untuk mengelola percakapan dengan pengunjung"
        title="Chatbot | Sistem Manajemen Pertanian"
      />

      {/* Breadcrumb Navigasi */}
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Chatbot", to: "/dashboard-admin/chatbot" },
        ]}
      />

      {/* Konten Utama */}
      <div className="container mx-auto px-4 mt-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Chatbot
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Kelola percakapan dengan pengunjung secara langsung
              </p>
            </div>
          </div>
        </div>

        {/* Card Informasi */}
        <Card
          className="shadow-lg border border-gray-200 dark:border-gray-700"
          shadow="none"
        >
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-5">
              {/* Ikon Peringatan */}
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <svg
                  className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>

              {/* Teks dan Tombol */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Maaf, Dashboard Tawk.to Tidak Bisa ditampilkan disini
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Untuk alasan keamanan, Tawk.to tidak mengizinkan dashboard-nya
                  ditampilkan di sini. Oleh karena itu, kami tidak dapat
                  menampilkannya langsung di sini.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Mohon Maaf Chat tidak bisa login lebih dari satu tab.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Silakan klik tombol di bawah untuk membuka dashboard Tawk.to
                  di tab baru dan login ke akun Anda.
                </p>

                <Button
                  color="primary"
                  size="md"
                  startContent={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  onPress={openInNewTab}
                >
                  Buka Dashboard Tawk.to
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer Kecil */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Login diperlukan. Pastikan Anda memiliki akun aktif di{" "}
            <a
              className="text-blue-600 hover:underline dark:text-blue-400"
              href="https://tawk.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tawk.to
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
