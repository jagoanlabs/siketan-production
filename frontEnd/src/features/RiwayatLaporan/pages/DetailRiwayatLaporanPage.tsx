import { useContext } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import { DetailRiwayatLaporanPenyuluh } from "../components/DetailRiwayatLaporanPenyuluh";
import { DetailRiwayatLaporanPetani } from "../components/DetailRiwayatLaporanPetani";

import HomeLayout from "@/layouts/HomeLayout";
import { Footer } from "@/features/Home/components/Footer";
import { AuthContext } from "@/context/AuthContext";

const DetailRiwayatLaporanPage = () => {
  const authContext = useContext(AuthContext);

  // This is a placeholder. In a real app, you would get the user role
  // and the specific report ID from the context and URL params.
  const userRole = authContext?.user?.peran || "petani"; // or 'penyuluh'

  return (
    <HomeLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Breadcrumbs>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/riwayat-laporan">
              Riwayat Laporan
            </BreadcrumbItem>
            <BreadcrumbItem>Detail Laporan</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Detail Laporan {userRole === "penyuluh" ? "Penyuluh" : "Petani"}
        </h1>

        <main>
          {userRole === "penyuluh" ? (
            <DetailRiwayatLaporanPenyuluh />
          ) : (
            <DetailRiwayatLaporanPetani />
          )}
        </main>
      </div>
      <Footer />
    </HomeLayout>
  );
};

export default DetailRiwayatLaporanPage;
