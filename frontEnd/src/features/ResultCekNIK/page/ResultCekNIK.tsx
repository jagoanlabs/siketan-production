import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { FaMapMarkerAlt, FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomeLayout from "@/layouts/HomeLayout";
import { Footer } from "@/features/Home/components/Footer";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { assets } from "@/assets/assets";

interface UserData {
  id: number;
  nik: string;
  nkk: string | null;
  foto: string | null;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  password: string | null;
  email: string | null;
  noTelp: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_penyuluhId: string | null;
  fk_kelompokId: string | null;
  kecamatanId: number;
  desaId: number;
  tanamanPetanis: any[];
  kelompok: any;
  kecamatanData: {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  };
  desaData: {
    id: number;
    nama: string;
    kecamatanId: number;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const ResultCekNIK = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Cek apakah ada data dari navigation state
    if (location.state?.userData) {
      setUserData(location.state.userData);
      setMessage(location.state.message || "Data ditemukan");
    } else {
      // Jika tidak ada data, redirect kembali ke halaman cek NIK
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const handleBackToSearch = () => {
    navigate("/", { replace: true });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userData) {
    return (
      <HomeLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </HomeLayout>
    );
  }

  return (
    <>
      <HomeLayout>
        <div className="p-3 sm:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem index={2} />
            </div>
            <div className="hidden sm:block">
              <Breadcrumbs>
                <BreadcrumbItem
                  classNames={{
                    base: "hover:cursor-pointer text-[#003F75] font-semibold",
                    item: "hover:cursor-pointer text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                  href="/"
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  classNames={{
                    base: "text-[#003F75] font-semibold",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                >
                  Cek NIK
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
            <div className="sm:hidden text-[#003F75] text-sm font-medium">
              Home / Cek NIK
            </div>
          </div>
        </div>
        {/* Search Section dengan tombol kembali */}
        <div className="w-full max-w-10/12 mx-auto px-3 sm:px-5">
          <div className="flex flex-col items-center justify-between w-full gap-4 px-4 py-6 bg-green-100 border-2 border-green-300 lg:flex-row lg:gap-6 sm:px-6 lg:px-8 sm:py-8 lg:py-6 rounded-xl lg:rounded-2xl mb-8">
            <div className="flex-1 w-full lg:max-w-xl">
              <h1 className="mb-3 text-xl font-semibold text-center text-gray-800 sm:mb-4 sm:text-2xl lg:text-3xl lg:text-left">
                Hasil Pencarian NIK
              </h1>
              <p className="text-sm text-center text-gray-600 sm:text-base lg:text-lg lg:text-left mb-4">
                {message}
              </p>
              <Button
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                onPress={handleBackToSearch}
              >
                <FaSearch className="mr-2" />
                Cari NIK Lain
              </Button>
            </div>
            <div className="relative justify-center flex-1 hidden lg:flex">
              <div className="relative w-full h-[20.5rem] xl:h-[22rem]">
                <img
                  alt="Ilustrasi Cek NIK"
                  className="absolute object-contain -top-[12%] w-full h-[120%]"
                  src={assets.imageDataPlant}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col w-full max-w-10/12 mx-auto mt-8 px-3 sm:px-5">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 sm:px-10 py-4 sm:py-5 bg-green-100 border-b border-green-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Data Petani Ditemukan
              </h2>
            </div>

            {/* Profile Header */}
            <div className="px-6 sm:px-10 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {userData.foto ? (
                    <img
                      alt={userData.nama}
                      className="w-full h-full rounded-full object-cover"
                      src={userData.foto}
                    />
                  ) : (
                    <FaUser className="text-gray-400 text-2xl sm:text-3xl" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {userData.nama}
                  </h3>
                  <p className="text-gray-600 mb-1">NIK: {userData.nik}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-2">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">
                      {userData.desaData.nama}, {userData.kecamatanData.nama}
                    </span>
                  </div>
                  {userData.noTelp && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                      <FaPhone className="text-sm" />
                      <span className="text-sm">{userData.noTelp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Information */}
            <div className="px-6 sm:px-10 py-6">
              <div className="grid w-full grid-cols-1 gap-8 lg:gap-10 text-base text-gray-700 lg:grid-cols-2">
                {/* Identitas Petani */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Identitas Petani
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Nama Lengkap:</span>
                      <span className="text-gray-600">{userData.nama}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">NIK:</span>
                      <span className="text-gray-600">{userData.nik}</span>
                    </div>
                    {userData.nkk && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium">NKK:</span>
                        <span className="text-gray-600">{userData.nkk}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Alamat:</span>
                      <span className="text-gray-600">{userData.alamat}</span>
                    </div>
                    {userData.noTelp && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium">No. Telepon:</span>
                        <span className="text-gray-600">{userData.noTelp}</span>
                      </div>
                    )}
                    {userData.email && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium">Email:</span>
                        <span className="text-gray-600">{userData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informasi Lokasi */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Informasi Lokasi
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Desa:</span>
                      <span className="text-gray-600">
                        {userData.desaData.nama}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Kecamatan:</span>
                      <span className="text-gray-600">
                        {userData.kecamatanData.nama}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Tipe Wilayah:</span>
                      <span className="text-gray-600">
                        {userData.desaData.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Kelompok */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Status Kelompok
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Kelompok Tani:</span>
                      <span className="text-gray-600">
                        {userData.kelompok
                          ? userData.kelompok.nama
                          : "Belum tergabung"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Status Penyuluh:</span>
                      <span className="text-gray-600">
                        {userData.fk_penyuluhId ? "Ada" : "Belum ada"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informasi Tanaman */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Informasi Tanaman
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Jumlah Tanaman:</span>
                      <span className="text-gray-600">
                        {userData.tanamanPetanis.length} tanaman terdaftar
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Terdaftar Sejak:</span>
                      <span className="text-gray-600">
                        {formatDate(userData.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium">Update Terakhir:</span>
                      <span className="text-gray-600">
                        {formatDate(userData.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
