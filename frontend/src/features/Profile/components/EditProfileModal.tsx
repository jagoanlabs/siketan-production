import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FiCamera,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Form/HeroModal";
import { Input, Textarea } from "@/components/Form/HeroInput";
import { Button } from "@/components/Form/HeroButton";
import { useUpdateProfile } from "@/hook/useEditProfile";
import { useAuth } from "@/hook/UseAuth";
import { assets } from "@/assets/assets";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    nama?: string;
    email?: string;
    no_wa?: string;
    alamat?: string;
    nik?: string;
    nokk?: string;
    namaProduct?: string;
    foto?: string | null;
    peran?: string;
  };
  initialTab?: "profile" | "password";
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  initialTab = "profile",
}) => {
  const { updateUser } = useAuth();
  const updateMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "password">(initialTab);

  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_wa: "",
    alamat: "",
    nik: "",
    nokk: "",
    namaProduct: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync state whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setFormData({
        nama: initialData.nama || "",
        email: initialData.email || "",
        no_wa: initialData.no_wa || "",
        alamat: initialData.alamat || "",
        nik: initialData.nik || "",
        nokk: initialData.nokk || "",
        namaProduct: initialData.namaProduct || "",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
      setPreviewImage(initialData.foto || null);
      setSelectedFile(null);
    }
  }, [isOpen, initialData, initialTab]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file foto maksimal 5MB");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format foto harus JPG, PNG, WEBP, atau GIF");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation for Profile Tab
    if (activeTab === "profile") {
      if (!formData.nama.trim()) {
        toast.error("Nama lengkap tidak boleh kosong");
        return;
      }
      if (!formData.email.trim()) {
        toast.error("Email tidak boleh kosong");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error("Format email tidak valid (contoh: user@gmail.com)");
        return;
      }

      if (formData.no_wa) {
        const cleanPhone = formData.no_wa.replace(/\D/g, "");
        if (!cleanPhone.startsWith("08")) {
          toast.error("Nomor WhatsApp harus diawali dengan 08");
          return;
        }
        if (cleanPhone.length < 10 || cleanPhone.length > 14) {
          toast.error("Nomor WhatsApp harus terdiri dari 10 - 14 digit angka");
          return;
        }
      }

      const payload: any = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        no_wa: formData.no_wa.trim(),
        alamat: formData.alamat.trim(),
      };

      if (formData.nik) payload.nik = formData.nik.trim();
      if (formData.nokk) payload.nokk = formData.nokk.trim();
      if (formData.namaProduct) payload.namaProduct = formData.namaProduct.trim();
      if (selectedFile) payload.foto = selectedFile;

      try {
        await updateMutation.mutateAsync(payload);
        updateUser({
          nama: formData.nama.trim(),
          email: formData.email.trim(),
          no_wa: formData.no_wa.trim(),
          ...(previewImage ? { foto: previewImage } : {}),
        });
        onClose();
      } catch {
        // error toast already handled in mutation
      }
    } else {
      // 2. Validation for Password Tab
      if (!passwordData.currentPassword) {
        toast.error("Password saat ini harus diisi");
        return;
      }
      if (!passwordData.newPassword) {
        toast.error("Password baru tidak boleh kosong");
        return;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error("Password baru minimal 6 karakter");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Konfirmasi password baru tidak cocok");
        return;
      }

      const payload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      try {
        await updateMutation.mutateAsync(payload);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      } catch {
        // error toast handled in mutation
      }
    }
  };

  const isRolePetani =
    initialData.peran === "petani" || initialData.peran === "Petani";
  const isRolePenyuluh =
    initialData.peran === "penyuluh" ||
    initialData.peran === "penyuluh_swadaya" ||
    initialData.peran === "Penyuluh Pertanian";
  const isRoleOperator =
    initialData.peran === "operator poktan" ||
    initialData.peran === "operator_poktan";

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        {() => (
          <form className="flex flex-col h-full" onSubmit={handleSubmit}>
            <ModalHeader className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Pengaturan Profil
                  </h3>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    Perbarui informasi akun dan keamanan kata sandi Anda
                  </p>
                </div>

                {/* Tab Pill Selector */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium">
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                      activeTab === "profile"
                        ? "bg-emerald-600 text-white shadow-sm font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                    }`}
                    style={activeTab === "profile" ? { backgroundColor: "#059669", color: "#ffffff" } : undefined}
                    type="button"
                    onClick={() => setActiveTab("profile")}
                  >
                    <FiUser className="text-sm" />
                    <span>Data Diri</span>
                  </button>
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                      activeTab === "password"
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                    }`}
                    style={activeTab === "password" ? { backgroundColor: "#2563eb", color: "#ffffff" } : undefined}
                    type="button"
                    onClick={() => setActiveTab("password")}
                  >
                    <FiLock className="text-sm" />
                    <span>Ganti Password</span>
                  </button>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="py-5 px-6 space-y-5">
              {activeTab === "profile" ? (
                <>
                  {/* Photo Upload Section */}
                  <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-transparent rounded-2xl border border-emerald-100/60">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-md bg-white">
                        <img
                          alt="Foto Profil"
                          className="w-full h-full object-cover"
                          src={previewImage || assets.defaultPicture}
                        />
                      </div>
                      <label
                        className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[11px]"
                        htmlFor="profile-photo-input"
                      >
                        <FiCamera className="text-lg mb-0.5" />
                        <span>Ubah</span>
                      </label>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Foto Profil
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">
                        Format JPG, PNG, WEBP atau GIF. Maksimal ukuran 5 MB.
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          id="profile-photo-input"
                          type="file"
                          onChange={handleFileChange}
                        />
                        <Button
                          as="label"
                          className="cursor-pointer text-xs font-medium px-3 h-8 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          htmlFor="profile-photo-input"
                          size="sm"
                        >
                          <FiCamera />
                          Pilih Foto
                        </Button>
                        {previewImage && (
                          <Button
                            className="text-xs px-3 h-8 text-rose-600 border border-rose-200 hover:bg-rose-50"
                            size="sm"
                            type="button"
                            variant="light"
                            onClick={handleRemovePhoto}
                          >
                            <FiTrash2 />
                            Hapus
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        disabled={updateMutation.isPending}
                        placeholder="Masukkan nama lengkap"
                        startContent={<FiUser className="text-gray-400" />}
                        value={formData.nama}
                        variant="bordered"
                        onChange={(e: any) =>
                          handleInputChange("nama", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Akun <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        disabled={updateMutation.isPending}
                        placeholder="contoh: user@gmail.com"
                        startContent={<FiMail className="text-gray-400" />}
                        type="email"
                        value={formData.email}
                        variant="bordered"
                        onChange={(e: any) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Nomor HP / WhatsApp
                      </label>
                      <Input
                        disabled={updateMutation.isPending}
                        placeholder="Contoh: 081234567890"
                        startContent={<FiPhone className="text-gray-400" />}
                        value={formData.no_wa}
                        variant="bordered"
                        onChange={(e: any) =>
                          handleInputChange("no_wa", e.target.value)
                        }
                      />
                    </div>

                    {/* Role Specific Fields */}
                    {(isRolePetani || isRolePenyuluh || isRoleOperator) && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {isRolePenyuluh ? "NIP / NIK" : "Nomor Induk Kependudukan (NIK)"}
                        </label>
                        <Input
                          disabled={updateMutation.isPending}
                          maxLength={18}
                          placeholder="Masukkan NIK 16 digit"
                          startContent={<FiShield className="text-gray-400" />}
                          value={formData.nik}
                          variant="bordered"
                          onChange={(e: any) =>
                            handleInputChange("nik", e.target.value)
                          }
                        />
                      </div>
                    )}

                    {isRolePetani && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Nomor Kartu Keluarga (No. KK)
                        </label>
                        <Input
                          disabled={updateMutation.isPending}
                          maxLength={16}
                          placeholder="Masukkan No. KK 16 digit"
                          startContent={<FiShield className="text-gray-400" />}
                          value={formData.nokk}
                          variant="bordered"
                          onChange={(e: any) =>
                            handleInputChange("nokk", e.target.value)
                          }
                        />
                      </div>
                    )}

                    {isRolePenyuluh && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Nama Produk Pertanian Binaan
                        </label>
                        <Input
                          disabled={updateMutation.isPending}
                          placeholder="Contoh: Beras Organik"
                          value={formData.namaProduct}
                          variant="bordered"
                          onChange={(e: any) =>
                            handleInputChange("namaProduct", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Alamat Domisili
                      </label>
                      <Textarea
                        disabled={updateMutation.isPending}
                        placeholder="Masukkan alamat domisili lengkap (Dusun, RT/RW, Desa, Kecamatan)"
                        rows={3}
                        value={formData.alamat}
                        variant="bordered"
                        onChange={(e: any) =>
                          handleInputChange("alamat", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Password Change Tab */
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                    <FiLock className="text-amber-600 text-lg mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <p className="font-semibold mb-0.5">
                        Perubahan Kata Sandi
                      </p>
                      <p className="text-amber-700">
                        Untuk keamanan akun, Anda harus memasukkan password saat ini
                        sebelum membuat password baru. Gunakan minimal 6 karakter.
                      </p>
                    </div>
                  </div>

                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Password Saat Ini <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      disabled={updateMutation.isPending}
                      endContent={
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          tabIndex={-1}
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                        >
                          {showPassword.current ? (
                            <FiEyeOff className="text-base" />
                          ) : (
                            <FiEye className="text-base" />
                          )}
                        </button>
                      }
                      placeholder="Masukkan password saat ini"
                      startContent={<FiLock className="text-gray-400" />}
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      variant="bordered"
                      onChange={(e: any) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      disabled={updateMutation.isPending}
                      endContent={
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          tabIndex={-1}
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                        >
                          {showPassword.new ? (
                            <FiEyeOff className="text-base" />
                          ) : (
                            <FiEye className="text-base" />
                          )}
                        </button>
                      }
                      placeholder="Masukkan password baru (min. 6 karakter)"
                      startContent={<FiLock className="text-gray-400" />}
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      variant="bordered"
                      onChange={(e: any) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Konfirmasi Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      disabled={updateMutation.isPending}
                      endContent={
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          tabIndex={-1}
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                        >
                          {showPassword.confirm ? (
                            <FiEyeOff className="text-base" />
                          ) : (
                            <FiEye className="text-base" />
                          )}
                        </button>
                      }
                      placeholder="Ulangi password baru"
                      startContent={<FiLock className="text-gray-400" />}
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      variant="bordered"
                      onChange={(e: any) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>

                  {/* Password Checklist Requirements */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      {passwordData.newPassword.length >= 6 ? (
                        <FiCheck className="text-emerald-500 font-bold" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1" />
                      )}
                      <span
                        className={
                          passwordData.newPassword.length >= 6
                            ? "text-emerald-700 font-medium"
                            : ""
                        }
                      >
                        Minimal 6 karakter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordData.newPassword &&
                      passwordData.newPassword === passwordData.confirmPassword ? (
                        <FiCheck className="text-emerald-500 font-bold" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1" />
                      )}
                      <span
                        className={
                          passwordData.newPassword &&
                          passwordData.newPassword === passwordData.confirmPassword
                            ? "text-emerald-700 font-medium"
                            : ""
                        }
                      >
                        Konfirmasi kata sandi cocok
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-gray-100 pt-3 flex justify-end gap-2.5">
              <Button
                disabled={updateMutation.isPending}
                size="md"
                type="button"
                variant="bordered"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-4"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                color={activeTab === "password" ? "secondary" : "success"}
                className={`font-semibold px-5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] border-0 text-white ${
                  activeTab === "password"
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                }`}
                style={{
                  backgroundColor: activeTab === "password" ? "#2563eb" : "#059669",
                  color: "#ffffff",
                }}
                disabled={updateMutation.isPending}
                isLoading={updateMutation.isPending}
                size="md"
                type="submit"
              >
                {updateMutation.isPending
                  ? "Menyimpan..."
                  : activeTab === "password"
                  ? "Ubah Password"
                  : "Simpan Perubahan"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
