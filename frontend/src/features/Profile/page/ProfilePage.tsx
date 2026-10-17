import { useState } from "react";
import { FiEdit3, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import { assets } from "@/assets/assets";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { Footer } from "@/features/Home/components/Footer";
import { useAuth } from "@/hook/UseAuth";
import HomeLayout from "@/layouts/HomeLayout";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
import { useProfile } from "@/hook/useProfile";
import { Button } from "@/components/Form/HeroButton";
import {
  OperatorProfile,
  PenyuluhProfile,
  PetaniProfile,
} from "@/types/profile";
import { EditProfileModal } from "../components/EditProfileModal";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profileResponse, isLoading, error } = useProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"profile" | "password">("profile");

  const openEditModal = (tab: "profile" | "password" = "profile") => {
    setModalTab(tab);
    setIsEditModalOpen(true);
  };

  // Get profile data based on user role
  const profileData = profileResponse?.data;
  const accountData =
    user?.peran === "operator super admin" ? user : profileData;

  // Format role display name
  const getRoleDisplayName = () => {
    if (user?.role?.display_name) {
      return user.role.display_name;
    }
    if (user?.peran === "penyuluh") {
      return "Penyuluh Pertanian";
    }
    if (user?.peran === "petani") {
      return "Petani";
    }
    if (user?.peran === "operator poktan") {
      return "Operator Poktan";
    }
    if (user?.peran === "operator super admin") {
      return "Operator Super Admin";
    }

    return user?.peran || "User";
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate experience years
  const calculateExperience = () => {
    const createdAt =
      user?.peran === "operator super admin"
        ? user?.createdAt
        : (accountData as any)?.createdAt;

    if (!createdAt) return "0 tahun";
    const startDate = new Date(createdAt);
    const now = new Date();
    const years = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
    );

    return `${years} tahun`;
  };

  // Get profile photo
  const getProfilePhoto = () => {
    if (user?.peran === "operator super admin") {
      return user?.foto || assets.defaultPicture;
    }

    return (
      (accountData as any)?.foto ||
      (accountData as any)?.tbl_akun?.foto ||
      user?.foto ||
      assets.defaultPicture
    );
  };

  // Get user name
  const getUserName = () => {
    if (user?.peran === "operator super admin") {
      return user?.nama || "Nama Pengguna";
    }

    return (
      (accountData as any)?.nama ||
      (accountData as any)?.tbl_akun?.nama ||
      user?.nama ||
      "Nama Pengguna"
    );
  };

  // Get verification status
  const getVerificationStatus = () => {
    if (user?.peran === "operator super admin") {
      return user?.isVerified;
    }

    return (accountData as any)?.tbl_akun?.isVerified ?? user?.isVerified;
  };

  // Get contact info
  const getContactInfo = () => {
    if (user?.peran === "operator super admin") {
      return {
        phone: user?.no_wa || "-",
        email: user?.email || "-",
        pekerjaan: user?.role?.display_name || "-",
      };
    }

    const tblAkun = (accountData as any)?.tbl_akun;

    return {
      phone: (accountData as any)?.noTelp || tblAkun?.no_wa || user?.no_wa || "-",
      email: (accountData as any)?.email || tblAkun?.email || user?.email || "-",
      pekerjaan: tblAkun?.peran || user?.peran || "-",
    };
  };

  // Get address based on role
  const getAddress = () => {
    if (user?.peran === "operator super admin") {
      return "-";
    }

    const data = accountData as
      | PenyuluhProfile
      | PetaniProfile
      | OperatorProfile;

    if (!data) return "-";

    // For Penyuluh
    if ("kecamatanData" in data && "desaData" in data) {
      const kecamatan = data.kecamatanData?.nama || data.kecamatan;
      const desa = data.desaData?.nama || data.desa;

      return desa && kecamatan
        ? `Desa ${desa}, Kecamatan ${kecamatan}, Kab. Ngawi`
        : (data as any)?.alamat || "-";
    }

    // For Petani / Operator
    return (data as any).alamat || "-";
  };

  // Get role-specific information
  const getRoleSpecificInfo = () => {
    if (user?.peran === "operator super admin") {
      return {
        joinDate: formatDate(user?.createdAt?.toString() || ""),
        experience: calculateExperience(),
        specialInfo: [],
      };
    }

    const data = accountData as PenyuluhProfile | PetaniProfile;

    if (user?.peran === "penyuluh") {
      const penyuluhData = data as PenyuluhProfile;
      const desaBinaan =
        penyuluhData?.desaBinaanData
          ?.map((item) => item.desa?.nama)
          .filter(Boolean)
          .join(", ") || "-";
      const kecamatanBinaan =
        penyuluhData?.kecamatanBinaanData
          ?.map((item) => item.kecamatan?.nama)
          .filter(Boolean)
          .join(", ") || "-";

      return {
        joinDate: formatDate(penyuluhData?.createdAt || ""),
        experience: calculateExperience(),
        specialInfo: [
          { label: "NIP / NIK", value: penyuluhData?.nik || "-" },
          { label: "Tipe Penyuluh", value: penyuluhData?.tipe || "-" },
          { label: "Desa Binaan", value: desaBinaan },
          { label: "Kecamatan Binaan", value: kecamatanBinaan },
          { label: "Nama Produk Binaan", value: penyuluhData?.namaProduct || "-" },
        ],
      };
    }

    if (user?.peran === "petani") {
      const petaniData = data as PetaniProfile;

      return {
        joinDate: formatDate(petaniData?.createdAt || ""),
        experience: calculateExperience(),
        specialInfo: [
          { label: "NIK", value: petaniData?.nik || "-" },
          { label: "NKK", value: petaniData?.nkk || "-" },
          {
            label: "Kelompok Tani",
            value:
              petaniData?.kelompoks?.[0]?.namaKelompok || "Tidak ada kelompok",
          },
          {
            label: "Gapoktan",
            value: petaniData?.kelompoks?.[0]?.gapoktan || "-",
          },
          { label: "Penyuluh", value: petaniData?.dataPenyuluh?.nama || "-" },
        ],
      };
    }

    // For operator poktan
    return {
      joinDate: formatDate((data as OperatorProfile)?.createdAt || ""),
      experience: calculateExperience(),
      specialInfo: [
        { label: "NIK", value: (data as any)?.nik || "-" },
      ],
    };
  };

  const contactInfo = getContactInfo();
  const roleInfo = getRoleSpecificInfo();

  // Prepare initial data for modal
  const modalInitialData = {
    nama: getUserName(),
    email: contactInfo.email !== "-" ? contactInfo.email : user?.email || "",
    no_wa: contactInfo.phone !== "-" ? contactInfo.phone : user?.no_wa || "",
    alamat: (accountData as any)?.alamat || "",
    nik: (accountData as any)?.nik || (accountData as any)?.NIK || "",
    nokk: (accountData as any)?.nkk || (accountData as any)?.nokk || "",
    namaProduct: (accountData as any)?.namaProduct || "",
    foto: getProfilePhoto(),
    peran: user?.peran || (accountData as any)?.tbl_akun?.peran || "",
  };

  if (isLoading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          <span className="ml-3 text-gray-600">Memuat data profil...</span>
        </div>
      </HomeLayout>
    );
  }

  if (error) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">Gagal memuat profil</div>
            <p className="text-gray-600">
              Silakan refresh halaman atau coba lagi nanti
            </p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <>
      <HomeLayout>
        <div className="p-5">
          <div className="w-full px-10 py-5 text-center h-52 rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-6">
              <NavbarStaticItem index={null} />
            </div>
          </div>
        </div>

        <SectionInfoPertanianCard
          subtitle={`Profile ${getRoleDisplayName()} Kab. Ngawi`}
          title="Profile"
        />

        <div className="flex flex-col w-11/12 lg:w-9/12 mx-auto mb-14">
          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-md bg-gray-50 flex-shrink-0">
                  <img
                    alt="Profile"
                    className="object-cover w-full h-full"
                    src={getProfilePhoto()}
                  />
                </div>
                <button
                  aria-label="Ubah Foto"
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  title="Klik untuk ubah profil"
                  type="button"
                  onClick={() => openEditModal("profile")}
                >
                  <FiEdit3 className="text-xl" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{getUserName()}</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {getRoleDisplayName()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-mono">{contactInfo.email}</p>
                <div className="pt-1 flex items-center gap-1.5">
                  {getVerificationStatus() ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <FiCheckCircle className="text-sm" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <FiAlertCircle className="text-sm" /> Belum Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
              <Button
                color="success"
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-4 sm:px-5 h-11 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                style={{ backgroundColor: "#059669", color: "#ffffff" }}
                size="md"
                onPress={() => openEditModal("profile")}
              >
                <FiEdit3 className="text-lg text-white" />
                <span className="text-white font-semibold">Edit Profil</span>
              </Button>
              <Button
                color="secondary"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 sm:px-5 h-11 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                size="md"
                onPress={() => openEditModal("password")}
              >
                <FiLock className="text-lg text-white" />
                <span className="text-white font-semibold">Ganti Password</span>
              </Button>
            </div>
          </div>

          {/* Profile Details Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mt-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Informasi Akun & Data Diri
                </h3>
                <p className="text-xs text-gray-500">
                  Data diri yang tersimpan dan terhubung dengan akun Anda
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer"
                type="button"
                onClick={() => openEditModal("profile")}
              >
                <FiEdit3 className="text-sm text-emerald-600" />
                <span>Ubah Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              {/* Nomor Telepon */}
              <div className="text-gray-500 font-medium flex items-center">
                Nomor WhatsApp / Telepon
              </div>
              <div className="break-all font-medium text-gray-800">
                {contactInfo.phone}
              
              </div>

              {/* Email */}
              <div className="text-gray-500 font-medium flex items-center">
                Email
              </div>
              <div className="break-all font-medium text-gray-800">
                {contactInfo.email}
              </div>
              

              {/* Pekerjaan */}
              <div className="text-gray-500 font-medium">Peran / Pekerjaan</div>
              <div className="font-medium text-gray-800 capitalize">
                {contactInfo.pekerjaan}
              </div>
              <div />

              {/* Alamat */}
              <div className="text-gray-500 font-medium flex items-center">
                Alamat Domisili
              </div>
              <div className="font-medium text-gray-800">
                {getAddress()}
              </div>
              
              
              {/* Divider */}
              <div className="col-span-1 sm:col-span-3">
                <hr className="my-2 border-gray-100" />
              </div>

              {/* Bergabung Sejak */}
              <div className="text-gray-500 font-medium">Bergabung Sejak</div>
              <div className="font-medium text-gray-800">{roleInfo.joinDate}</div>
              <div />

              {/* Masa Aktif */}
              <div className="text-gray-500 font-medium">Masa Pengalaman</div>
              <div className="font-medium text-gray-800">{roleInfo.experience}</div>
              <div />

              {/* Role-specific information */}
              {roleInfo.specialInfo.map((info, index) => (
                <div key={`info-row-${index}`} className="contents">
                  <div className="text-gray-500 font-medium">{info.label}</div>
                  <div className="font-medium text-gray-800">{info.value}</div>
                  <div />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile & Password Modal */}
        <EditProfileModal
          initialData={modalInitialData}
          initialTab={modalTab}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </HomeLayout>
      <Footer />
    </>
  );
};
export default ProfilePage;
