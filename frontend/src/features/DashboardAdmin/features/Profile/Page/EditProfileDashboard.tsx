import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/Form/HeroButton";
import { Input } from "@/components/Form/HeroInput";
import PageMeta from "@/layouts/PageMeta";
import { assets } from "@/assets/assets";
import { useAuth } from "@/hook/UseAuth";
import { useUpdateProfile } from "@/hook/dashboard/profile/useUpdateUser";

type PasswordField = "current" | "new" | "confirm";

export const EditProfileDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuth();
  const profileMutation = useUpdateProfile();
  const passwordMutation = useUpdateProfile();

  const [profile, setProfile] = useState({
    nama: user?.nama || "",
    email: user?.email || "",
    no_wa: user?.no_wa || "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(user?.foto || "");
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setProfile({
      nama: user?.nama || "",
      email: user?.email || "",
      no_wa: user?.no_wa || "",
    });
    setPhotoPreview(user?.foto || "");
  }, [user?.nama, user?.email, user?.no_wa, user?.foto]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Gunakan foto berformat JPG, PNG, atau WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5 MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profile.nama.trim() || !profile.email.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      toast.error("Format email belum valid");
      return;
    }
    const phone = profile.no_wa.replace(/\D/g, "");
    if (phone && (phone.length < 10 || phone.length > 14)) {
      toast.error("Nomor WhatsApp harus terdiri dari 10–14 digit");
      return;
    }

    try {
      const response = await profileMutation.mutateAsync({
        userId: user?.id.toString() || "",
        data: {
          nama: profile.nama.trim(),
          email: profile.email.trim(),
          no_wa: phone,
          foto: photo,
        },
      });

      updateUser({
        nama: profile.nama.trim(),
        email: profile.email.trim(),
        no_wa: phone,
        ...(response.data?.foto ? { foto: response.data.foto } : {}),
      });
      setPhoto(null);
      toast.success("Profil berhasil diperbarui");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password.currentPassword) {
      toast.error("Password saat ini wajib diisi");
      return;
    }
    if (password.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }

    try {
      await passwordMutation.mutateAsync({
        userId: user?.id.toString() || "",
        data: {
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        },
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password berhasil diperbarui");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal memperbarui password");
    }
  };

  const passwordToggle = (field: PasswordField) => (
    <button
      aria-label={visible[field] ? "Sembunyikan password" : "Tampilkan password"}
      className="p-1 text-gray-400 hover:text-gray-700"
      type="button"
      onClick={() => setVisible((current) => ({ ...current, [field]: !current[field] }))}
    >
      {visible[field] ? <FiEyeOff /> : <FiEye />}
    </button>
  );

  return (
    <div className="container mx-auto min-h-screen max-w-6xl py-6">
      <PageMeta
        description="Perbarui profil dan password akun"
        title="Edit Profil | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Profil", to: "/dashboard-admin/profile" },
          { label: "Edit Profil" },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
          <p className="mt-1 text-sm text-gray-500">
            Perbarui informasi akun atau ganti password Anda.
          </p>
        </div>
        <Button
          className="self-start"
          startContent={<FiArrowLeft />}
          variant="bordered"
          onPress={() => navigate("/dashboard-admin/profile")}
        >
          Kembali ke Profil
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <form
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          onSubmit={handleProfileSubmit}
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-semibold text-gray-900">Informasi Profil</h2>
            <p className="mt-1 text-sm text-gray-500">Data ini tampil pada akun Anda.</p>
          </div>

          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <img
              alt={`Foto profil ${profile.nama || "pengguna"}`}
              className="h-24 w-24 rounded-full border border-gray-200 object-cover"
              src={photoPreview || assets.defaultPicture}
            />
            <div>
              <input
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                type="file"
                onChange={handlePhotoChange}
              />
              <Button
                startContent={<FiCamera />}
                type="button"
                variant="bordered"
                onPress={() => fileInputRef.current?.click()}
              >
                Pilih Foto
              </Button>
              <p className="mt-2 text-xs text-gray-500">JPG, PNG, atau WEBP. Maksimal 5 MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              isRequired
              isDisabled={profileMutation.isPending}
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              startContent={<FiUser />}
              value={profile.nama}
              variant="bordered"
              onValueChange={(nama: string) => setProfile((value) => ({ ...value, nama }))}
            />
            <Input
              isRequired
              isDisabled={profileMutation.isPending}
              label="Email"
              placeholder="nama@email.com"
              startContent={<FiMail />}
              type="email"
              value={profile.email}
              variant="bordered"
              onValueChange={(email: string) => setProfile((value) => ({ ...value, email }))}
            />
            <Input
              className="sm:col-span-2"
              isDisabled={profileMutation.isPending}
              label="Nomor WhatsApp"
              placeholder="Contoh: 081234567890"
              startContent={<FiPhone />}
              value={profile.no_wa}
              variant="bordered"
              onValueChange={(no_wa: string) => setProfile((value) => ({ ...value, no_wa }))}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button type="button" variant="light" onPress={() => navigate("/dashboard-admin/profile")}>
              Batal
            </Button>
            <Button
              color="success"
              isLoading={profileMutation.isPending}
              startContent={<FiSave />}
              type="submit"
            >
              Simpan Profil
            </Button>
          </div>
        </form>

        <form
          className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          onSubmit={handlePasswordSubmit}
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              <FiLock className="text-gray-500" /> Ganti Password
            </h2>
            <p className="mt-1 text-sm text-gray-500">Gunakan minimal 6 karakter.</p>
          </div>

          <div className="space-y-4 py-6">
            <Input
              isRequired
              endContent={passwordToggle("current")}
              isDisabled={passwordMutation.isPending}
              label="Password Saat Ini"
              value={password.currentPassword}
              variant="bordered"
              type={visible.current ? "text" : "password"}
              onValueChange={(currentPassword: string) =>
                setPassword((value) => ({ ...value, currentPassword }))
              }
            />
            <Input
              isRequired
              endContent={passwordToggle("new")}
              isDisabled={passwordMutation.isPending}
              label="Password Baru"
              value={password.newPassword}
              variant="bordered"
              type={visible.new ? "text" : "password"}
              onValueChange={(newPassword: string) =>
                setPassword((value) => ({ ...value, newPassword }))
              }
            />
            <Input
              isRequired
              endContent={passwordToggle("confirm")}
              isDisabled={passwordMutation.isPending}
              label="Konfirmasi Password Baru"
              value={password.confirmPassword}
              variant="bordered"
              type={visible.confirm ? "text" : "password"}
              onValueChange={(confirmPassword: string) =>
                setPassword((value) => ({ ...value, confirmPassword }))
              }
            />
          </div>

          <Button
            className="w-full"
            color="success"
            isLoading={passwordMutation.isPending}
            type="submit"
          >
            Perbarui Password
          </Button>
        </form>
      </div>
    </div>
  );
};
