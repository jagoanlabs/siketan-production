import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useContext } from "react";

import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { AuthContext } from "@/context/AuthContext";
import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";

// Mock data for demonstration purposes
const laporanPetani = [
  {
    id: 1,
    title: "Laporan Serangan Hama Wereng",
    date: "2024-07-28",
    status: "Selesai",
  },
  {
    id: 2,
    title: "Laporan Kekeringan",
    date: "2024-07-25",
    status: "Dalam Proses",
  },
  {
    id: 3,
    title: "Laporan Penggunaan Pupuk",
    date: "2024-07-22",
    status: "Ditolak",
  },
];

const laporanPenyuluh = [
  {
    id: 1,
    title: "Laporan Pendampingan Kelompok Tani",
    date: "2024-07-27",
    status: "Disetujui",
  },
  {
    id: 2,
    title: "Laporan Kegiatan Penyuluhan",
    date: "2024-07-24",
    status: "Menunggu Persetujuan",
  },
  {
    id: 3,
    title: "Laporan Monitoring Hama",
    date: "2024-07-21",
    status: "Selesai",
  },
];

export const RiwayatLaporanPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { user } = authContext;
  const isPenyuluh = user?.peran === "penyuluh";
  const laporan = isPenyuluh ? laporanPenyuluh : laporanPetani;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Selesai":
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Dalam Proses":
      case "Menunggu Persetujuan":
        return "bg-yellow-100 text-yellow-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <HomeLayout>
        {/* Header Section with Navbar - Responsive */}
        <div className="p-3 sm:p-4 lg:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem />
            </div>

            {/* Breadcrumbs - Responsive */}
            <div className="mt-4 sm:mt-6">
              <Breadcrumbs className="sm:text-base" size="sm">
                <BreadcrumbItem
                  classNames={{
                    base: "hover:cursor-pointer text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "hover:cursor-pointer text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                  href="/"
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  classNames={{
                    base: "text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                >
                  Informasi Pertanian
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>

        {/* Hero Banner - Responsive */}
        <SectionInfoPertanianCard
          subtitle="Riwayat Laporan Penyuluh di Kab. Ngawi"
          title="Riwayat Laporan"
        />

        {/* Main Content - Responsive */}
        <div className="container mx-auto p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Riwayat Laporan {isPenyuluh ? "Penyuluh" : "Petani"}
          </h1>
          <div className="space-y-4">
            {laporan.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                  <button className="text-blue-500 hover:underline">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
