import { useEffect, useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FaDownload, FaUpload } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import {
  useRiwayatImport,
  useUploadRealisasi,
} from "@/hook/dashboard/Statistika/useStatistika";
import { useAuth } from "@/hook/UseAuth";
import { axiosClient } from "@/service/app-service";
import { LoadingModal } from "@/components/LoadingModal";

export const RiwayatRealisasi = () => {
  const { user: currentUser } = useAuth();

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingProgress = 0;

  // Riwayat query and upload mutation
  const { data: riwayatResponse, isLoading: isRiwayatLoading, refetch: refetchRiwayat } = useRiwayatImport();
  const riwayatList = riwayatResponse?.data || [];
  const uploadRealisasiMutation = useUploadRealisasi();

  useEffect(() => {
    refetchRiwayat();
  }, [refetchRiwayat]);

  const handleDownloadTemplate = async (id: number, filename: string) => {
    try {
      toast.info("Sedang menyiapkan template realisasi...");
      const response = await axiosClient.get(`/statistik/riwayat/${id}/download-template`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `formulir_realisasi_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Template realisasi berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal mengunduh template realisasi");
      console.error("Download template error:", error);
    }
  };

  const handleUploadRealisasi = (riwayatId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("File harus berformat .xlsx atau .xls");
          return;
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          toast.error("Ukuran file maksimal 10MB");
          return;
        }

        setShowLoadingModal(true);
        setLoadingMessage(`Mengunggah file realisasi ${file.name}...`);
        try {
          await uploadRealisasiMutation.mutateAsync({ id: riwayatId, file });
          await refetchRiwayat();
        } finally {
          setShowLoadingModal(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Riwayat Realisasi Massal | Siketan"
        title="Riwayat Realisasi Massal | Siketan"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Riwayat Realisasi Massal" },
        ]}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={showLoadingModal}
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={true}
        type="processing"
      />

      <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Riwayat Unggah & Realisasi Massal
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Unduh template realisasi dan unggah berkas yang telah diisi untuk memperbarui data realisasi secara massal.
            </p>
          </div>
          <Button
            isIconOnly
            color="primary"
            variant="flat"
            onPress={() => refetchRiwayat()}
            title="Refresh Riwayat"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRiwayatLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200/60 dark:border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider border-b border-gray-200/60 dark:border-gray-800">
                <th className="py-3.5 px-4 text-center">No</th>
                <th className="py-3.5 px-4">Tanggal Unggah</th>
                <th className="py-3.5 px-4">Nama Berkas</th>
                <th className="py-3.5 px-4 text-center">Jumlah Data</th>
                <th className="py-3.5 px-4 text-center">Uploader</th>
                <th className="py-3.5 px-4 text-center">Status Realisasi</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-sm">
              {isRiwayatLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                      <span>Memuat riwayat...</span>
                    </div>
                  </td>
                </tr>
              ) : riwayatList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <BsFiletypeXlsx className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Belum ada riwayat unggahan</span>
                      <span className="text-xs text-gray-400">Silakan lakukan impor data terlebih dahulu di halaman "Statistika Pertanian".</span>
                    </div>
                  </td>
                </tr>
              ) : (
                riwayatList.map((item, index) => {
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-";
                  const canAction = currentUser?.peran === 'operator super admin' ||
                    currentUser?.peran === 'super admin' ||
                    item.fk_akunId === currentUser?.id;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="py-4 px-4 text-center font-medium text-gray-600 dark:text-gray-400">{index + 1}</td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">{dateStr}</td>
                      <td className="py-4 px-4 text-gray-755 dark:text-gray-345">
                        <div className="flex items-center gap-2">
                          <BsFiletypeXlsx className="text-green-600 w-4 h-4 flex-shrink-0" />
                          <span className="truncate max-w-[200px]" title={item.namaFile}>{item.namaFile}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-805 text-gray-700 dark:text-gray-300 rounded-full font-semibold text-xs">
                          {item.jumlahData} baris
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-xs text-gray-605 dark:text-gray-395">
                        <div className="font-semibold">{item.uploader?.nama || "-"}</div>
                        <div className="text-[10px] text-gray-400 italic">({item.uploader?.peran || "-"})</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Chip
                          color={item.statusRealisasi === "sudah" ? "success" : "warning"}
                          size="sm"
                          variant="flat"
                        >
                          {item.statusRealisasi === "sudah" ? "Sudah Realisasi" : "Belum Realisasi"}
                        </Chip>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          {canAction ? (
                            <>
                              <Tooltip content="Unduh Template Realisasi">
                                <Button
                                  isIconOnly
                                  color="success"
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleDownloadTemplate(item.id, `formulir_realisasi_langsung_${item.id}.xlsx`)}
                                >
                                  <FaDownload className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </Button>
                              </Tooltip>

                              <Tooltip content={item.statusRealisasi === "sudah" ? "Unggah Ulang Realisasi (Timpa)" : "Unggah Realisasi"}>
                                  <Button
                                    isIconOnly
                                    color="primary"
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleUploadRealisasi(item.id)}
                                  >
                                    <FaUpload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </Button>
                                </Tooltip>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Tidak ada akses</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
