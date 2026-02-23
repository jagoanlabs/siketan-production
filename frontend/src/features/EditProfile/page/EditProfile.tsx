// pages/EditProfile.tsx
import { PenyuluhEditForm } from "../components/PenyuluhEditForm";
import { OperatorPoktanEditForm } from "../components/OperatorPoktanEditForm";
import { OperatorEditForm } from "../components/OperatorEditForm";
import { PetaniEditForm } from "../components/PetaniEditForm";

import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
import HomeLayout from "@/layouts/HomeLayout";
import { Footer } from "@/features/Home/components/Footer";
import { useAuth } from "@/hook/UseAuth";
export const EditProfile = () => {
  const { user, isLoading } = useAuth();

  // Render appropriate form based on user role
  const renderEditForm = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          <span className="ml-2">Memuat...</span>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">User tidak ditemukan</p>
        </div>
      );
    }

    const userRole = user.peran || user.role?.name;

    switch (userRole) {
      case "petani":
        return <PetaniEditForm />;
      case "penyuluh":
      case "penyuluh_swadaya":
        return <PenyuluhEditForm />;
      case "operator_super_admin":
        return <OperatorEditForm />;
      case "operator poktan":
        return <OperatorPoktanEditForm />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-red-500">
              Form edit untuk role &quot;{userRole}&quot; belum tersedia
            </p>
          </div>
        );
    }
  };

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
          subtitle={`Profile ${user?.nama} Kab. Ngawi`}
          title="Edit Profile"
        />

        <div className="flex flex-col w-full max-w-7xl mx-auto px-4 mb-10">
          {renderEditForm()}
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
