import { assets } from "@/assets/assets";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { Footer } from "@/features/Home/components/Footer";
import { useAuth } from "@/hook/UseAuth";
import HomeLayout from "@/layouts/HomeLayout";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
import { useProfile } from "@/hook/useProfile";
import {
  OperatorProfile,
  PenyuluhProfile,
  PetaniProfile,
} from "@/types/profile";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profileResponse, isLoading, error } = useProfile();

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
      "Nama Pengguna"
    );
  };

  // Get verification status
  const getVerificationStatus = () => {
    if (user?.peran === "operator super admin") {
      return user?.isVerified;
    }

    return (accountData as any)?.tbl_akun?.isVerified;
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

    console.log("tblAkun", tblAkun);

    return {
      phone: (accountData as any)?.noTelp || tblAkun?.no_wa || "-",
      email: (accountData as any)?.email || tblAkun?.email || "-",
      pekerjaan: tblAkun?.peran || "-",
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

      return `Desa ${desa}, Kecamatan ${kecamatan}, Kab. Ngawi`;
    }

    // For Operator
    return (data as OperatorProfile).alamat || "-";
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
          ?.map((item) => item.desa.nama)
          .join(", ") || "-";
      const kecamatanBinaan =
        penyuluhData?.kecamatanBinaanData
          ?.map((item) => item.kecamatan.nama)
          .join(", ") || "-";

      return {
        joinDate: formatDate(penyuluhData?.createdAt || ""),
        experience: calculateExperience(),
        specialInfo: [
          { label: "Tipe Penyuluh", value: penyuluhData?.tipe || "-" },
          { label: "Desa Binaan", value: desaBinaan },
          { label: "Kecamatan Binaan", value: kecamatanBinaan },
          { label: "Nama Product", value: penyuluhData?.namaProduct || "-" },
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
              petaniData?.kelompoks?.[0].namaKelompok || "Tidak ada kelompok",
          },
          {
            label: "Gapoktan",
            value: petaniData?.kelompoks?.[0].gapoktan || "-",
          },
          { label: "Penyuluh", value: petaniData?.dataPenyuluh?.nama || "-" },
        ],
      };
    }

    // For operator poktan
    return {
      joinDate: formatDate((data as OperatorProfile)?.createdAt || ""),
      experience: calculateExperience(),
      specialInfo: [],
    };
  };

  const contactInfo = getContactInfo();
  const roleInfo = getRoleSpecificInfo();

  if (isLoading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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

        <div className="flex flex-col w-10/12 mx-auto space-x-6 mb-10">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 overflow-hidden border-2 border-gray-300 rounded-full">
                <img
                  alt="Profile"
                  className="object-cover w-full h-full"
                  src={getProfilePhoto()}
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">{getUserName()}</h1>
                <p className="text-gray-600">{getRoleDisplayName()}</p>
                <p
                  className={
                    getVerificationStatus()
                      ? "text-green-600 text-sm"
                      : "text-yellow-600 text-sm"
                  }
                >
                  {getVerificationStatus()
                    ? "✓ Terverifikasi"
                    : "Belum Terverifikasi"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 gap-4 mt-10 text-sm sm:grid-cols-3">
            {/* Informasi Kontak */}
            <div className="text-gray-500 font-medium">Nomor Telepon</div>
            <div className="break-all">{contactInfo.phone}</div>
            <div className="text-blue-600 cursor-pointer hover:underline" />

            <div className="text-gray-500 font-medium">Email</div>
            <div className="break-all">{contactInfo.email}</div>
            <div className="text-blue-600 cursor-pointer hover:underline" />

            <div className="text-gray-500 font-medium">Pekerjaan</div>
            <div>{contactInfo.pekerjaan}</div>
            <div className="text-blue-600 cursor-pointer hover:underline" />

            <div className="text-gray-500 font-medium">Alamat Domisili</div>
            <div>{getAddress()}</div>
            <div className="text-blue-600 cursor-pointer hover:underline" />

            {/* Divider */}
            <div className="col-span-1 sm:col-span-3">
              <hr className="my-4 border-gray-300" />
            </div>

            <div className="text-gray-500 font-medium">Bergabung Sejak</div>
            <div>{roleInfo.joinDate}</div>
            <div />

            {/* Role-specific information */}
            {roleInfo.specialInfo.map((info, index) => (
              <>
                <div
                  key={`label-${index}`}
                  className="text-gray-500 font-medium"
                >
                  {info.label}
                </div>
                <div key={`value-${index}`}>{info.value}</div>
                <div key={`action-${index}`} />
              </>
            ))}

            {/* Divider */}
            {roleInfo.specialInfo.length > 0 && (
              <div className="col-span-1 sm:col-span-3">
                <hr className="my-4 border-gray-300" />
              </div>
            )}
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
