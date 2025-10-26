import { Button } from "@heroui/button";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner"; // Import toast dari sonner

import { assets } from "@/assets/assets";
import { axiosClient } from "@/service/app-service";
import { useAuth } from "@/hook/UseAuth";

export const CekNIK = () => {
  const navigate = useNavigate();
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();

  // Daftar role yang tidak diizinkan untuk cek NIK
  const restrictedRoles = ["petani", "penyuluh", "penyuluh_swadaya"];

  const handleCariClick = async () => {
    // Cek authentication terlebih dahulu
    if (!isAuthenticated) {
      toast.error("Anda harus login terlebih dahulu");
      navigate("/login");

      return;
    }

    // Cek apakah user memiliki role yang tidak diizinkan
    if (user?.peran && restrictedRoles.includes(user.peran)) {
      toast.error("Anda tidak diizinkan untuk melakukan pencarian NIK");

      return;
    }

    // Validasi input
    if (!nik.trim()) {
      setError("NIK harus diisi");

      return;
    }

    // Validasi format NIK (16 digit)
    if (!/^\d{16}$/.test(nik.trim())) {
      setError("NIK harus 16 digit angka");

      return;
    }

    try {
      setLoading(true);
      setError("");

      // API call menggunakan apiClient.post
      const response = await axiosClient.post("/cek-nik", {
        nik: nik.trim(),
      });

      // Jika sukses, navigate ke result page dengan data
      navigate("/cek-NIK", {
        state: {
          userData: response.data.user,
          message: response.data.message,
        },
      });
    } catch (err: any) {
      console.error("Error checking NIK:", err);

      // Handle different error cases
      if (err.response?.status === 400 || err.response?.status === 404) {
        setError(err.response.data.message || "NIK tidak ditemukan");
      } else if (err.response?.status === 403) {
        toast.error("Anda tidak memiliki akses untuk melakukan pencarian NIK");
      } else {
        setError("Terjadi kesalahan, silakan coba lagi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCariClick();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full gap-4 px-4 py-6 bg-green-100 border-2 border-green-300 lg:flex-row lg:gap-6 sm:px-6 lg:px-8 sm:py-8 lg:py-6 rounded-xl lg:rounded-2xl"
      id="cek-nik"
    >
      {/* Left Section - Content */}
      <div className="flex-1 w-full lg:max-w-xl">
        <h1 className="mb-3 text-xl font-semibold text-center text-gray-800 sm:mb-4 sm:text-2xl lg:text-3xl lg:text-left">
          Cek NIK Petani
        </h1>

        {/* Search Bar Container */}
        <div
          className="flex items-center w-full lg:max-w-md px-2 sm:px-3 py-1.5 sm:py-2 
  bg-white shadow-md rounded-lg sm:rounded-xl overflow-hidden"
        >
          {/* Search Icon */}
          <div className="pl-1 text-gray-400 sm:pl-2 flex-shrink-0">
            <FaSearch className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </div>

          {/* Input Field */}
          <input
            className="flex-1 px-1 sm:px-2 lg:px-3 py-2 sm:py-2.5 
      text-xs sm:text-sm lg:text-base 
      focus:outline-none placeholder-gray-400 min-w-0"
            maxLength={16}
            placeholder="NIK (16 digit)"
            type="text"
            value={nik}
            onChange={(e) => {
              setNik(e.target.value);
              if (error) setError("");
            }}
            onKeyPress={handleKeyPress}
          />

          {/* Search Button - Tampilan sama untuk semua role */}
          <Button
            className="
      flex-shrink-0 min-w-[50px] sm:min-w-[60px] lg:min-w-[80px]
      px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5
      text-xs sm:text-sm lg:text-base font-semibold text-white 
      bg-green-500 hover:bg-green-600 transition-colors 
      rounded-md sm:rounded-lg
      disabled:bg-gray-400 disabled:cursor-not-allowed
    "
            disabled={loading}
            isLoading={loading}
            onPress={handleCariClick}
          >
            <span className="block sm:hidden">{loading ? "..." : "Cari"}</span>
            <span className="hidden sm:block">
              {loading ? "Mencari..." : "Cari"}
            </span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <p className="mt-3 text-sm text-center text-gray-600 sm:mt-4 sm:text-base lg:text-lg lg:text-left">
          Cek data petani berdasarkan Nomor Induk Kependudukan disini!
        </p>
      </div>

      {/* Right Section - Image (Hidden on Mobile) */}
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
  );
};
